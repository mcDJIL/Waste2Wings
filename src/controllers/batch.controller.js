const ApiError = require('../utils/ApiError');
const prisma = require('../prismaClient');
const { ROLES, SUBMISSION_STATUS } = require('../utils/status');

function generateBatchCode() {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `HEN-BATCH-${datePart}-${randomPart}`;
}

function getBatchInclude() {
  return {
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
    stakeholderSetting: true,
    items: {
      include: {
        submission: {
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
        },
      },
    },
  };
}

function toBatchResponse(batch) {
  return {
    id: batch.id,
    collectorProfileId: batch.collectorProfileId,
    stakeholderSettingId: batch.stakeholderSettingId,
    batchCode: batch.batchCode,
    totalCleanLiter: batch.totalCleanLiter,
    requestedPricePerLiter: batch.requestedPricePerLiter,
    estimatedTotalPrice: batch.estimatedTotalPrice,
    status: batch.status,
    finalLiter: batch.finalLiter,
    finalTotalPrice: batch.finalTotalPrice,
    stakeholderNote: batch.stakeholderNote,
    collector: batch.collectorProfile,
    stakeholderSetting: batch.stakeholderSetting,
    items: batch.items,
    createdAt: batch.createdAt,
    updatedAt: batch.updatedAt,
  };
}

async function createBatch(req, res, next) {
  try {
    const { body } = req.validated;
    const collector = await prisma.collectorProfile.findUnique({ where: { userId: req.user.id } });

    if (!collector) {
      throw new ApiError(400, 'Collector profile is not configured');
    }

    const stakeholderSetting = await prisma.stakeholderSetting.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (!stakeholderSetting) {
      throw new ApiError(400, 'Stakeholder reception setting is not configured yet');
    }

    const submissions = await prisma.communitySubmission.findMany({
      where: {
        id: { in: body.submissionIds },
        collectorProfileId: collector.id,
        status: SUBMISSION_STATUS.ACCEPTED_BY_COLLECTOR,
      },
      orderBy: { createdAt: 'asc' },
    });

    if (submissions.length !== body.submissionIds.length) {
      throw new ApiError(400, 'Some submissions are invalid, not accepted, or not owned by this collector');
    }

    const totalCleanLiter = submissions.reduce((total, submission) => total + submission.cleanLiter, 0);

    if (totalCleanLiter <= 0) {
      throw new ApiError(400, 'Batch total clean liter must be greater than zero');
    }

    const batch = await prisma.$transaction(async (tx) => {
      const createdBatch = await tx.collectorBatch.create({
        data: {
          collectorProfileId: collector.id,
          stakeholderSettingId: stakeholderSetting.id,
          batchCode: generateBatchCode(),
          totalCleanLiter,
          requestedPricePerLiter: stakeholderSetting.referencePricePerLiter,
          estimatedTotalPrice: totalCleanLiter * stakeholderSetting.referencePricePerLiter,
          items: {
            create: submissions.map((submission) => ({
              submissionId: submission.id,
              cleanLiterAllocated: submission.cleanLiter,
            })),
          },
        },
      });

      await tx.communitySubmission.updateMany({
        where: { id: { in: submissions.map((submission) => submission.id) } },
        data: { status: SUBMISSION_STATUS.IN_BATCH },
      });

      return tx.collectorBatch.findUnique({
        where: { id: createdBatch.id },
        include: getBatchInclude(),
      });
    });

    res.status(201).json({ batch: toBatchResponse(batch) });
  } catch (error) {
    next(error);
  }
}

async function getBatches(req, res, next) {
  try {
    const where = {};

    if (req.user.role === ROLES.COLLECTOR) {
      const collector = await prisma.collectorProfile.findUnique({ where: { userId: req.user.id } });
      where.collectorProfileId = collector ? collector.id : '__not_found__';
    }

    if (req.query.status) {
      where.status = req.query.status;
    }

    const batches = await prisma.collectorBatch.findMany({
      where,
      include: getBatchInclude(),
      orderBy: { createdAt: 'desc' },
    });

    res.json({ batches: batches.map(toBatchResponse) });
  } catch (error) {
    next(error);
  }
}

async function getBatchById(req, res, next) {
  try {
    const batch = await prisma.collectorBatch.findUnique({
      where: { id: req.params.id },
      include: getBatchInclude(),
    });

    if (!batch) {
      throw new ApiError(404, 'Batch not found');
    }

    if (req.user.role === ROLES.COLLECTOR && batch.collectorProfile.userId !== req.user.id) {
      throw new ApiError(403, 'You do not have permission to access this batch');
    }

    res.json({ batch: toBatchResponse(batch) });
  } catch (error) {
    next(error);
  }
}

module.exports = { createBatch, getBatchById, getBatches };
