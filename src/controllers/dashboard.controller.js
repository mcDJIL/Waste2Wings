const prisma = require('../prismaClient');
const { BATCH_STATUS, ROLES, SUBMISSION_STATUS } = require('../utils/status');

function getMonthKey(date) {
  return date.toISOString().slice(0, 7);
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

module.exports = { getDashboardMap, getDashboardSummary, getDashboardTrends };
