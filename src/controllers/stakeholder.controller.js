const prisma = require('../prismaClient');

async function getStakeholderSetting(req, res, next) {
  try {
    const setting = await prisma.stakeholderSetting.findFirst({
      orderBy: { updatedAt: 'desc' },
      include: {
        updatedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({ setting });
  } catch (error) {
    next(error);
  }
}

async function upsertStakeholderSetting(req, res, next) {
  try {
    const { body } = req.validated;
    const existingSetting = await prisma.stakeholderSetting.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    const data = {
      referencePricePerLiter: body.referencePricePerLiter,
      receptionLocationName: body.receptionLocationName,
      receptionAddress: body.receptionAddress,
      latitude: body.latitude,
      longitude: body.longitude,
      updatedById: req.user.id,
    };

    const setting = existingSetting
      ? await prisma.stakeholderSetting.update({
          where: { id: existingSetting.id },
          data,
        })
      : await prisma.stakeholderSetting.create({ data });

    res.json({ setting });
  } catch (error) {
    next(error);
  }
}

module.exports = { getStakeholderSetting, upsertStakeholderSetting };
