const prisma = require("../prismaClient");
const { writeAuditLog } = require("../utils/audit");
const { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES } = require("../utils/status");

// get the latest stakeholder setting
async function getStakeholderSetting(req, res, next) {
  try {
    const setting = await prisma.stakeholderSetting.findFirst({
      orderBy: { updatedAt: "desc" },
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

// create or update stakeholder setting
async function upsertStakeholderSetting(req, res, next) {
  try {
    const { body } = req.validated;

    const setting = await prisma.$transaction(async (tx) => {
      const existingSetting = await prisma.stakeholderSetting.findFirst({
        orderBy: { updatedAt: "desc" },
      });

      const data = {
        referencePricePerLiter: body.referencePricePerLiter,
        receptionLocationName: body.receptionLocationName,
        receptionAddress: body.receptionAddress,
        latitude: body.latitude,
        longitude: body.longitude,
        updatedById: req.user.id,
      };

      const savedSetting = existingSetting
        ? await prisma.stakeholderSetting.update({
            where: { id: existingSetting.id },
            data,
          })
        : await prisma.stakeholderSetting.create({ data });

      await writeAuditLog(tx, {
        req,
        actorId: req.user.id,
        entityType: AUDIT_ENTITY_TYPES.STAKEHOLDER_SETTING,
        entityId: savedSetting.id,
        action: existingSetting ? AUDIT_ACTIONS.UPDATE : AUDIT_ACTIONS.CREATE,
        before: existingSetting,
        after: savedSetting,
        reason: body.reason,
      });

      return savedSetting;
    });

    res.json({ setting });
  } catch (error) {
    next(error);
  }
}

module.exports = { getStakeholderSetting, upsertStakeholderSetting };
