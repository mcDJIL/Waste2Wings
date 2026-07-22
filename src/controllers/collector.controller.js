const ApiError = require('../utils/ApiError');
const { calculateDistanceKm } = require('../utils/haversine');
const prisma = require('../prismaClient');

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
      orderBy: { createdAt: 'desc' },
    });

    res.json({ collectors: collectors.map((collector) => toCollectorResponse(collector)) });
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

module.exports = { getCollectors, getNearbyCollectors, updateMyCollectorPrice };
