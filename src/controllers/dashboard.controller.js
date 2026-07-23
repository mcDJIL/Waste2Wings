const prisma = require('../prismaClient');
const { BATCH_STATUS, ROLES, SUBMISSION_STATUS } = require('../utils/status');

function getMonthKey(date) {
  return date.toISOString().slice(0, 7);
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

module.exports = {
  getCommunityDashboard,
  getDashboardMap,
  getDashboardSummary,
  getDashboardTrends,
};
