const prisma = require('../prismaClient');
const { ROLES } = require('../utils/status');

function getProfileInclude(role) {
  if (role === ROLES.COMMUNITY) {
    return { communityProfile: true };
  }

  if (role === ROLES.COLLECTOR) {
    return { collectorProfile: true };
  }

  return { stakeholderProfile: true };
}

function toProfileResponse(user) {
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    profile: user.communityProfile || user.collectorProfile || user.stakeholderProfile,
  };
}

async function getMyProfile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: getProfileInclude(req.user.role),
    });

    res.json(toProfileResponse(user));
  } catch (error) {
    next(error);
  }
}

async function updateMyProfile(req, res, next) {
  try {
    const { body } = req.validated;

    const user = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: req.user.id },
        data: {
          name: body.name,
          phone: body.phone,
        },
      });

      if (req.user.role === ROLES.COMMUNITY) {
        await tx.communityProfile.update({
          where: { userId: req.user.id },
          data: body.profile,
        });
      }

      if (req.user.role === ROLES.COLLECTOR) {
        await tx.collectorProfile.update({
          where: { userId: req.user.id },
          data: body.profile,
        });
      }

      if (req.user.role === ROLES.STAKEHOLDER) {
        await tx.stakeholderProfile.update({
          where: { userId: req.user.id },
          data: body.profile,
        });
      }

      return tx.user.findUnique({
        where: { id: req.user.id },
        include: getProfileInclude(req.user.role),
      });
    });

    res.json(toProfileResponse(user));
  } catch (error) {
    next(error);
  }
}

module.exports = { getMyProfile, updateMyProfile };
