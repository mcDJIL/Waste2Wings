const prisma = require('../prismaClient');
const { BATCH_STATUS, ROLES, SUBMISSION_STATUS } = require('../utils/status');

function getMonthKey(date) {
  return date.toISOString().slice(0, 7);
}

function getStartOfCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

function getCommunityActivity(submission) {
  const collectorName = submission.collectorProfile.companyName;

  if (submission.status === SUBMISSION_STATUS.ACCEPTED_BY_COLLECTOR) {
    return {
      type: 'SUBMISSION_ACCEPTED',
      message: `Setoran ${submission.cleanLiter || 0} liter diterima oleh ${collectorName}`,
      createdAt: submission.updatedAt,
    };
  }

  if (submission.status === SUBMISSION_STATUS.REJECTED_BY_COLLECTOR) {
    return {
      type: 'SUBMISSION_REJECTED',
      message: `Setoran ditolak oleh ${collectorName}`,
      createdAt: submission.updatedAt,
    };
  }

  if (submission.status === SUBMISSION_STATUS.IN_BATCH) {
    return {
      type: 'SUBMISSION_IN_BATCH',
      message: `Setoran ${submission.cleanLiter || 0} liter sudah masuk batch pengepul`,
      createdAt: submission.updatedAt,
    };
  }

  if (submission.status === SUBMISSION_STATUS.COMPLETED) {
    return {
      type: 'SUBMISSION_COMPLETED',
      message: `Setoran ${submission.cleanLiter || 0} liter sudah selesai diproses sampai stakeholder`,
      createdAt: submission.updatedAt,
    };
  }

  return {
    type: 'SUBMISSION_CREATED',
    message: `Pengajuan setoran ${submission.estimatedLiter} liter dibuat ke ${collectorName}`,
    createdAt: submission.createdAt,
  };
}

// get data for dashboard page
async function getDashboardSummary(req, res, next) {
  try {
    const [communityCount, collectorCount, acceptedSubmissionAggregate, completedBatchAggregate, pendingBatchCount, acceptedBatchCount] =
      await Promise.all([
        prisma.communityProfile.count(),
        prisma.collectorProfile.count({ where: { isActive: true } }),
        prisma.communitySubmission.aggregate({
          where: {
            status: {
              in: [
                SUBMISSION_STATUS.ACCEPTED_BY_COLLECTOR,
                SUBMISSION_STATUS.IN_BATCH,
                SUBMISSION_STATUS.COMPLETED,
              ],
            },
          },
          _sum: {
            cleanLiter: true,
            totalPaid: true,
          },
        }),
        prisma.collectorBatch.aggregate({
          where: { status: BATCH_STATUS.ACCEPTED_BY_STAKEHOLDER },
          _sum: {
            finalLiter: true,
            finalTotalPrice: true,
          },
        }),
        prisma.collectorBatch.count({
          where: { status: { in: [BATCH_STATUS.SUBMITTED_TO_STAKEHOLDER, BATCH_STATUS.LAB_REVIEW] } },
        }),
        prisma.collectorBatch.count({ where: { status: BATCH_STATUS.ACCEPTED_BY_STAKEHOLDER } }),
      ]);

    res.json({
      summary: {
        communityCount,
        activeCollectorCount: collectorCount,
        cleanLiterCollected: acceptedSubmissionAggregate._sum.cleanLiter || 0,
        paidToCommunity: acceptedSubmissionAggregate._sum.totalPaid || 0,
        finalLiterAcceptedByStakeholder: completedBatchAggregate._sum.finalLiter || 0,
        finalPurchaseAmount: completedBatchAggregate._sum.finalTotalPrice || 0,
        pendingBatchCount,
        acceptedBatchCount,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getDashboardMap(req, res, next) {
  try {
    const [communities, collectors] = await Promise.all([
      prisma.communityProfile.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.collectorProfile.findMany({
        where: { isActive: true },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    res.json({
      markers: [
        ...communities.map((community) => ({
          type: 'COMMUNITY',
          id: community.id,
          name: community.user.name,
          category: community.category,
          address: community.address,
          latitude: community.latitude,
          longitude: community.longitude,
          user: community.user,
        })),
        ...collectors.map((collector) => ({
          type: 'COLLECTOR',
          id: collector.id,
          name: collector.companyName,
          address: collector.address,
          latitude: collector.latitude,
          longitude: collector.longitude,
          capacityLiter: collector.capacityLiter,
          buyPricePerLiter: collector.buyPricePerLiter,
          user: collector.user,
        })),
      ],
    });
  } catch (error) {
    next(error);
  }
}

async function getDashboardTrends(req, res, next) {
  try {
    const acceptedBatches = await prisma.collectorBatch.findMany({
      where: { status: BATCH_STATUS.ACCEPTED_BY_STAKEHOLDER },
      orderBy: { createdAt: 'asc' },
      select: {
        createdAt: true,
        finalLiter: true,
        finalTotalPrice: true,
        requestedPricePerLiter: true,
      },
    });

    const trendByMonth = acceptedBatches.reduce((accumulator, batch) => {
      const month = getMonthKey(batch.createdAt);

      if (!accumulator[month]) {
        accumulator[month] = {
          month,
          batchCount: 0,
          totalFinalLiter: 0,
          totalPurchaseAmount: 0,
          averagePricePerLiter: 0,
        };
      }

      accumulator[month].batchCount += 1;
      accumulator[month].totalFinalLiter += batch.finalLiter || 0;
      accumulator[month].totalPurchaseAmount += batch.finalTotalPrice || 0;
      accumulator[month].averagePricePerLiter = accumulator[month].totalFinalLiter
        ? accumulator[month].totalPurchaseAmount / accumulator[month].totalFinalLiter
        : batch.requestedPricePerLiter;

      return accumulator;
    }, {});

    res.json({ trends: Object.values(trendByMonth) });
  } catch (error) {
    next(error);
  }
}

async function getCommunityDashboard(req, res, next) {
  try {
    const communityProfile = await prisma.communityProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!communityProfile) {
      return res.json({
        summary: {
          totalSubmissions: 0,
          totalCleanLiter: 0,
          totalEstimatedLiter: 0,
          totalPaid: 0,
          latestSubmission: null,
        },
        recentActivities: [],
        trends: [],
      });
    }

    const where = { communityProfileId: communityProfile.id };
    const [totalSubmissions, aggregate, latestSubmission, recentSubmissions, allSubmissions] = await Promise.all([
      prisma.communitySubmission.count({ where }),
      prisma.communitySubmission.aggregate({
        where,
        _sum: {
          estimatedLiter: true,
          cleanLiter: true,
          totalPaid: true,
        },
      }),
      prisma.communitySubmission.findFirst({
        where,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          status: true,
          estimatedLiter: true,
          cleanLiter: true,
          totalPaid: true,
          createdAt: true,
        },
      }),
      prisma.communitySubmission.findMany({
        where,
        include: {
          collectorProfile: {
            select: {
              companyName: true,
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
      prisma.communitySubmission.findMany({
        where,
        orderBy: { createdAt: 'asc' },
        select: {
          createdAt: true,
          cleanLiter: true,
          totalPaid: true,
        },
      }),
    ]);

    const trendsByMonth = allSubmissions.reduce((accumulator, submission) => {
      const month = getMonthKey(submission.createdAt);

      if (!accumulator[month]) {
        accumulator[month] = {
          month,
          submissionCount: 0,
          totalCleanLiter: 0,
          totalPaid: 0,
        };
      }

      accumulator[month].submissionCount += 1;
      accumulator[month].totalCleanLiter += submission.cleanLiter || 0;
      accumulator[month].totalPaid += submission.totalPaid || 0;

      return accumulator;
    }, {});

    res.json({
      summary: {
        totalSubmissions,
        totalCleanLiter: aggregate._sum.cleanLiter || 0,
        totalEstimatedLiter: aggregate._sum.estimatedLiter || 0,
        totalPaid: aggregate._sum.totalPaid || 0,
        latestSubmission,
      },
      recentActivities: recentSubmissions.map(getCommunityActivity),
      trends: Object.values(trendsByMonth),
    });
  } catch (error) {
    next(error);
  }
}

async function getCollectorDashboard(req, res, next) {
  try {
    const collectorProfile = await prisma.collectorProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!collectorProfile) {
      return res.json({
        summary: {
          totalIncomingLiter: 0,
          pendingValidationCount: 0,
          henSubmissionCount: 0,
          monthlyRevenueFromHen: 0,
          monthlyPaidToCommunity: 0,
          monthlyGrossMargin: 0,
        },
        latestSubmissions: [],
        volumeTrends: [],
      });
    }

    const collectorWhere = { collectorProfileId: collectorProfile.id };
    const monthStart = getStartOfCurrentMonth();
    const [incomingAggregate, pendingValidationCount, henSubmissionCount, monthlyRevenueAggregate, monthlyPaidAggregate, latestSubmissions, trendSubmissions] = await Promise.all([
      prisma.communitySubmission.aggregate({
        where: {
          ...collectorWhere,
          status: {
            in: [
              SUBMISSION_STATUS.ACCEPTED_BY_COLLECTOR,
              SUBMISSION_STATUS.IN_BATCH,
              SUBMISSION_STATUS.COMPLETED,
            ],
          },
        },
        _sum: { cleanLiter: true },
      }),
      prisma.communitySubmission.count({
        where: { ...collectorWhere, status: SUBMISSION_STATUS.SUBMITTED },
      }),
      prisma.collectorBatch.count({ where: { collectorProfileId: collectorProfile.id } }),
      prisma.collectorBatch.aggregate({
        where: {
          collectorProfileId: collectorProfile.id,
          status: BATCH_STATUS.ACCEPTED_BY_STAKEHOLDER,
          createdAt: { gte: monthStart },
        },
        _sum: { finalTotalPrice: true },
      }),
      prisma.communitySubmission.aggregate({
        where: {
          ...collectorWhere,
          createdAt: { gte: monthStart },
          status: {
            in: [
              SUBMISSION_STATUS.ACCEPTED_BY_COLLECTOR,
              SUBMISSION_STATUS.IN_BATCH,
              SUBMISSION_STATUS.COMPLETED,
            ],
          },
        },
        _sum: { totalPaid: true },
      }),
      prisma.communitySubmission.findMany({
        where: collectorWhere,
        include: {
          communityProfile: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
        take: 5,
      }),
      prisma.communitySubmission.findMany({
        where: {
          ...collectorWhere,
          status: {
            in: [
              SUBMISSION_STATUS.ACCEPTED_BY_COLLECTOR,
              SUBMISSION_STATUS.IN_BATCH,
              SUBMISSION_STATUS.COMPLETED,
            ],
          },
        },
        select: {
          createdAt: true,
          cleanLiter: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    const volumeTrendsByMonth = trendSubmissions.reduce((accumulator, submission) => {
      const month = getMonthKey(submission.createdAt);

      if (!accumulator[month]) {
        accumulator[month] = {
          month,
          totalCleanLiter: 0,
          submissionCount: 0,
        };
      }

      accumulator[month].totalCleanLiter += submission.cleanLiter || 0;
      accumulator[month].submissionCount += 1;

      return accumulator;
    }, {});

    const monthlyRevenueFromHen = monthlyRevenueAggregate._sum.finalTotalPrice || 0;
    const monthlyPaidToCommunity = monthlyPaidAggregate._sum.totalPaid || 0;

    res.json({
      summary: {
        totalIncomingLiter: incomingAggregate._sum.cleanLiter || 0,
        pendingValidationCount,
        henSubmissionCount,
        monthlyRevenueFromHen,
        monthlyPaidToCommunity,
        monthlyGrossMargin: monthlyRevenueFromHen - monthlyPaidToCommunity,
      },
      latestSubmissions: latestSubmissions.map((submission) => ({
        id: submission.id,
        status: submission.status,
        estimatedLiter: submission.estimatedLiter,
        cleanLiter: submission.cleanLiter,
        totalPaid: submission.totalPaid,
        communityName: submission.communityProfile.user.name,
        communityAddress: submission.communityProfile.address,
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
      })),
      volumeTrends: Object.values(volumeTrendsByMonth),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCommunityDashboard,
  getCollectorDashboard,
  getDashboardMap,
  getDashboardSummary,
  getDashboardTrends,
};
