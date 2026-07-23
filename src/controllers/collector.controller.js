const ApiError = require('../utils/ApiError');
const { calculateDistanceKm } = require('../utils/haversine');
const prisma = require('../prismaClient');
const { BATCH_STATUS, SUBMISSION_STATUS } = require('../utils/status');

function toCollectorResponse(collector, distanceKm) {
  return {
    id: collector.id,
    userId: collector.userId,
    companyName: collector.companyName,
    address: collector.address,
    latitude: collector.latitude,
    longitude: collector.longitude,
    capacityLiter: collector.capacityLiter,
    buyPricePerLiter: collector.buyPricePerLiter,
    isActive: collector.isActive,
    distanceKm: distanceKm === undefined ? undefined : Number(distanceKm.toFixed(2)),
    user: collector.user
      ? {
          id: collector.user.id,
          name: collector.user.name,
          email: collector.user.email,
          phone: collector.user.phone,
        }
      : undefined,
  };
}

async function getCollectors(req, res, next) {
  try {
    const { query } = req.validated;
    const search = query.q?.trim();
    const collectors = await prisma.collectorProfile.findMany({
      where: {
        isActive: true,
        ...(search
          ? {
              OR: [
                { companyName: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } },
                { user: { name: { contains: search, mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
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
    });

    res.json({
      query: search || null,
      total: collectors.length,
      collectors: collectors.map((collector) => toCollectorResponse(collector)),
    });
  } catch (error) {
    next(error);
  }
}

async function getNearbyCollectors(req, res, next) {
  try {
    const { query } = req.validated;
    const origin = {
      latitude: query.lat,
      longitude: query.lng,
    };
    const limit = query.limit || 10;

    const collectors = await prisma.collectorProfile.findMany({
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
    });

    const sortedCollectors = collectors
      .map((collector) => ({
        collector,
        distanceKm: calculateDistanceKm(origin, {
          latitude: collector.latitude,
          longitude: collector.longitude,
        }),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, limit)
      .map(({ collector, distanceKm }) => toCollectorResponse(collector, distanceKm));

    res.json({ collectors: sortedCollectors });
  } catch (error) {
    next(error);
  }
}

async function updateMyCollectorPrice(req, res, next) {
  try {
    const { body } = req.validated;
    const setting = await prisma.stakeholderSetting.findFirst({ orderBy: { updatedAt: 'desc' } });

    if (!setting) {
      throw new ApiError(400, 'Stakeholder reference price is not configured yet');
    }

    if (body.buyPricePerLiter > setting.referencePricePerLiter) {
      throw new ApiError(400, 'Collector buy price cannot exceed stakeholder reference price');
    }

    const collector = await prisma.collectorProfile.update({
      where: { userId: req.user.id },
      data: { buyPricePerLiter: body.buyPricePerLiter },
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
    });

    res.json({ collector: toCollectorResponse(collector) });
  } catch (error) {
    next(error);
  }
}

async function getMyCollectorHistory(req, res, next) {
  try {
    const { query } = req.validated;
    const collector = await prisma.collectorProfile.findUnique({ where: { userId: req.user.id } });

    if (!collector) {
      throw new ApiError(400, 'Collector profile is not configured');
    }

    const search = query.q?.trim();
    const where = {
      collectorProfileId: collector.id,
      ...(query.status ? { status: query.status } : {}),
      ...(query.from || query.to
        ? {
            createdAt: {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { communityProfile: { user: { name: { contains: search, mode: 'insensitive' } } } },
              { communityProfile: { address: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };

    const [submissions, aggregate, totalTransactions, revenueAggregate] = await Promise.all([
      prisma.communitySubmission.findMany({
        where,
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
        orderBy: { createdAt: 'desc' },
      }),
      prisma.communitySubmission.aggregate({
        where,
        _sum: {
          cleanLiter: true,
          totalPaid: true,
        },
      }),
      prisma.communitySubmission.count({ where }),
      prisma.collectorBatch.aggregate({
        where: {
          collectorProfileId: collector.id,
          status: BATCH_STATUS.ACCEPTED_BY_STAKEHOLDER,
        },
        _sum: { finalTotalPrice: true },
      }),
    ]);

    const totalPaidToCommunity = aggregate._sum.totalPaid || 0;
    const totalRevenueFromHen = revenueAggregate._sum.finalTotalPrice || 0;

    res.json({
      filters: {
        status: query.status || null,
        q: search || null,
        from: query.from || null,
        to: query.to || null,
      },
      summary: {
        totalCleanLiter: aggregate._sum.cleanLiter || 0,
        totalTransactions,
        totalPaidToCommunity,
        totalRevenueFromHen,
        grossMargin: totalRevenueFromHen - totalPaidToCommunity,
      },
      submissions: submissions.map((submission) => ({
        id: submission.id,
        status: submission.status,
        estimatedLiter: submission.estimatedLiter,
        actualLiter: submission.actualLiter,
        sedimentLiter: submission.sedimentLiter,
        cleanLiter: submission.cleanLiter,
        pricePerLiter: submission.pricePerLiter,
        totalPaid: submission.totalPaid,
        collectorNote: submission.collectorNote,
        community: {
          id: submission.communityProfile.id,
          name: submission.communityProfile.user.name,
          email: submission.communityProfile.user.email,
          phone: submission.communityProfile.user.phone,
          category: submission.communityProfile.category,
          address: submission.communityProfile.address,
          latitude: submission.communityProfile.latitude,
          longitude: submission.communityProfile.longitude,
        },
        createdAt: submission.createdAt,
        updatedAt: submission.updatedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
}

async function getMyCollectorMap(req, res, next) {
  try {
    const collector = await prisma.collectorProfile.findUnique({
      where: { userId: req.user.id },
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
    });

    if (!collector) {
      throw new ApiError(400, 'Collector profile is not configured');
    }

    const [stakeholderSetting, groupedSubmissions] = await Promise.all([
      prisma.stakeholderSetting.findFirst({ orderBy: { updatedAt: 'desc' } }),
      prisma.communitySubmission.groupBy({
        by: ['communityProfileId'],
        where: { collectorProfileId: collector.id },
        _count: { _all: true },
        _sum: { cleanLiter: true },
      }),
    ]);

    const communityProfiles = await prisma.communityProfile.findMany({
      where: { id: { in: groupedSubmissions.map((item) => item.communityProfileId) } },
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
    });

    const groupedByCommunityId = new Map(
      groupedSubmissions.map((item) => [item.communityProfileId, item]),
    );

    res.json({
      collector: toCollectorResponse(collector),
      henReceptionLocation: stakeholderSetting
        ? {
            id: stakeholderSetting.id,
            name: stakeholderSetting.receptionLocationName,
            address: stakeholderSetting.receptionAddress,
            latitude: stakeholderSetting.latitude,
            longitude: stakeholderSetting.longitude,
            referencePricePerLiter: stakeholderSetting.referencePricePerLiter,
          }
        : null,
      communityMarkers: communityProfiles.map((community) => {
        const grouped = groupedByCommunityId.get(community.id);

        return {
          id: community.id,
          name: community.user.name,
          category: community.category,
          address: community.address,
          latitude: community.latitude,
          longitude: community.longitude,
          totalCleanLiter: grouped?._sum.cleanLiter || 0,
          submissionCount: grouped?._count._all || 0,
          user: community.user,
        };
      }),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCollectors,
  getMyCollectorHistory,
  getMyCollectorMap,
  getNearbyCollectors,
  updateMyCollectorPrice,
};
