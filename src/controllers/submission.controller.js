const ApiError = require("../utils/ApiError");
const prisma = require("../prismaClient");
const {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  ROLES,
  SUBMISSION_STATUS,
} = require("../utils/status");

function toSubmissionResponse(submission) {
  return {
    id: submission.id,
    communityProfileId: submission.communityProfileId,
    collectorProfileId: submission.collectorProfileId,
    estimatedLiter: submission.estimatedLiter,
    status: submission.status,
    actualLiter: submission.actualLiter,
    sedimentLiter: submission.sedimentLiter,
    cleanLiter: submission.cleanLiter,
    pricePerLiter: submission.pricePerLiter,
    totalPaid: submission.totalPaid,
    collectorNote: submission.collectorNote,
    community: submission.communityProfile
      ? {
          id: submission.communityProfile.id,
          category: submission.communityProfile.category,
          address: submission.communityProfile.address,
          latitude: submission.communityProfile.latitude,
          longitude: submission.communityProfile.longitude,
          user: submission.communityProfile.user,
        }
      : undefined,
    collector: submission.collectorProfile
      ? {
          id: submission.collectorProfile.id,
          companyName: submission.collectorProfile.companyName,
          address: submission.collectorProfile.address,
          latitude: submission.collectorProfile.latitude,
          longitude: submission.collectorProfile.longitude,
          buyPricePerLiter: submission.collectorProfile.buyPricePerLiter,
          user: submission.collectorProfile.user,
        }
      : undefined,
    createdAt: submission.createdAt,
    updatedAt: submission.updatedAt,
  };
}

function getSubmissionInclude() {
  return {
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
    collectorProfile: {
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
  };
}

async function createSubmission(req, res, next) {
  try {
    const { body } = req.validated;
    const collector = await prisma.collectorProfile.findFirst({
      where: {
        id: body.collectorId,
        isActive: true,
      },
    });

    if (!collector) {
      throw new ApiError(404, "Active collector not found");
    }

    const communityProfile = await prisma.communityProfile.findUnique({
      where: { userId: req.user.id },
    });

    if (!communityProfile) {
      throw new ApiError(400, "Community profile is not configured");
    }

    const submission = await prisma.communitySubmission.create({
      data: {
        communityProfileId: communityProfile.id,
        collectorProfileId: collector.id,
        estimatedLiter: body.estimatedLiter,
      },
      include: getSubmissionInclude(),
    });

    res.status(201).json({ submission: toSubmissionResponse(submission) });
  } catch (error) {
    next(error);
  }
}

async function getSubmissions(req, res, next) {
  try {
    const where = {};

    if (req.user.role === ROLES.COMMUNITY) {
      const communityProfile = await prisma.communityProfile.findUnique({
        where: { userId: req.user.id },
      });
      where.communityProfileId = communityProfile
        ? communityProfile.id
        : "__not_found__";
    }

    if (req.user.role === ROLES.COLLECTOR) {
      const collector = await prisma.collectorProfile.findUnique({
        where: { userId: req.user.id },
      });
      where.collectorProfileId = collector ? collector.id : "__not_found__";
    }

    if (req.query.status) {
      where.status = req.query.status;
    }

    const submissions = await prisma.communitySubmission.findMany({
      where,
      include: getSubmissionInclude(),
      orderBy: { createdAt: "desc" },
    });

    res.json({ submissions: submissions.map(toSubmissionResponse) });
  } catch (error) {
    next(error);
  }
}

async function getSubmissionById(req, res, next) {
  try {
    const submission = await prisma.communitySubmission.findUnique({
      where: { id: req.params.id },
      include: getSubmissionInclude(),
    });

    if (!submission) {
      throw new ApiError(404, "Submission not found");
    }

    if (
      req.user.role === ROLES.COMMUNITY &&
      submission.communityProfile.userId !== req.user.id
    ) {
      throw new ApiError(
        403,
        "You do not have permission to access this submission",
      );
    }

    if (
      req.user.role === ROLES.COLLECTOR &&
      submission.collectorProfile.userId !== req.user.id
    ) {
      throw new ApiError(
        403,
        "You do not have permission to access this submission",
      );
    }

    res.json({ submission: toSubmissionResponse(submission) });
  } catch (error) {
    next(error);
  }
}

async function validateSubmissionByCollector(req, res, next) {
  try {
    const { body } = req.validated;
    const submission = await prisma.communitySubmission.findUnique({
      where: { id: req.params.id },
      include: { collectorProfile: true },
    });

    if (!submission) {
      throw new ApiError(404, "Submission not found");
    }

    if (submission.collectorProfile.userId !== req.user.id) {
      throw new ApiError(
        403,
        "You do not have permission to validate this submission",
      );
    }

    if (submission.status !== SUBMISSION_STATUS.SUBMITTED) {
      throw new ApiError(
        400,
        "Only submitted requests can be validated by collector",
      );
    }

    const isAccepted = body.status === SUBMISSION_STATUS.ACCEPTED_BY_COLLECTOR;
    const cleanLiter = isAccepted
      ? body.actualLiter - body.sedimentLiter
      : null;

    if (isAccepted && cleanLiter < 0) {
      throw new ApiError(
        400,
        "Sediment liter cannot be greater than actual liter",
      );
    }

    const updatedSubmission = await prisma.$transaction(async (tx) => {
      const savedSubmission = await tx.communitySubmission.update({
        where: { id: submission.id },
        data: {
          status: body.status,
          actualLiter: isAccepted ? body.actualLiter : null,
          sedimentLiter: isAccepted ? body.sedimentLiter : null,
          cleanLiter,
          pricePerLiter: isAccepted
            ? submission.collectorProfile.buyPricePerLiter
            : null,
          totalPaid: isAccepted
            ? cleanLiter * submission.collectorProfile.buyPricePerLiter
            : null,
          collectorNote: body.collectorNote,
        },
        include: getSubmissionInclude(),
      });

      await tx.auditLog.create({
        req,
        actorId: req.user.id,
        entityType: AUDIT_ENTITY_TYPES.COMMUNITY_SUBMISSION,
        entityId: submission.id,
        action: body.status === SUBMISSION_STATUS.ACCEPTED_BY_COLLECTOR ? AUDIT_ACTIONS.ACCEPT : AUDIT_ACTIONS.REJECT,
        before: submission,
        after: savedSubmission,
        reason: body.collectorNote,
      });

      return savedSubmission;
    });

    res.json({ submission: toSubmissionResponse(updatedSubmission) });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createSubmission,
  getSubmissionById,
  getSubmissions,
  validateSubmissionByCollector,
};
