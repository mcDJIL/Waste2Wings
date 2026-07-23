const ApiError = require("../utils/ApiError");
const prisma = require("../prismaClient");
const {
  AUDIT_ACTIONS,
  AUDIT_ENTITY_TYPES,
  BATCH_STATUS,
} = require("../utils/status");

async function ensureEditableBatch(batchId) {
  const batch = await prisma.collectorBatch.findUnique({
    where: { id: batchId },
  });

  if (!batch) {
    throw new ApiError(404, "Batch not found");
  }

  if (
    [
      BATCH_STATUS.ACCEPTED_BY_STAKEHOLDER,
      BATCH_STATUS.REJECTED_BY_STAKEHOLDER,
    ].includes(batch.status)
  ) {
    throw new ApiError(
      400,
      "Lab result cannot be changed after final stakeholder validation",
    );
  }

  return batch;
}

async function createLabResult(req, res, next) {
  try {
    const { body } = req.validated;
    const batch = await ensureEditableBatch(req.params.batchId);
    const existingLabResult = await prisma.labResult.findUnique({
      where: { batchId: batch.id },
    });

    if (existingLabResult) {
      throw new ApiError(409, "Lab result already exists for this batch");
    }

    const labResult = await prisma.$transaction(async (tx) => {
      const createdLabResult = await tx.labResult.create({
        data: {
          batchId: batch.id,
          waterContentPercent: body.waterContentPercent,
          ffaPercent: body.ffaPercent,
          impurityPercent: body.impurityPercent,
          grade: body.grade,
          notes: body.notes,
          testedById: req.user.id,
        },
      });

      await tx.collectorBatch.update({
        where: { id: batch.id },
        data: { status: BATCH_STATUS.LAB_REVIEW },
      });

      await writeAuditLog(tx, {
        req,
        actorId: req.user.id,
        entityType: AUDIT_ENTITY_TYPES.LAB_RESULT,
        entityId: createdLabResult.id,
        action: AUDIT_ACTIONS.CREATE,
        before: null,
        after: createdLabResult,
        reason: body.notes,
      });

      return createdLabResult;
    });

    res.status(201).json({ labResult });
  } catch (error) {
    next(error);
  }
}

async function getLabResultByBatch(req, res, next) {
  try {
    const labResult = await prisma.labResult.findUnique({
      where: { batchId: req.params.batchId },
      include: {
        testedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({ labResult });
  } catch (error) {
    next(error);
  }
}

async function updateLabResult(req, res, next) {
  try {
    const { body } = req.validated;
    const labResult = await prisma.labResult.findUnique({
      where: { id: req.params.id },
    });

    if (!labResult) {
      throw new ApiError(404, "Lab result not found");
    }

    await ensureEditableBatch(labResult.batchId);

    const updatedLabResult = await prisma.$transaction(async (tx) => {
      const savedLabResult = await tx.labResult.update({
        where: { id: labResult.id },
        data: {
          waterContentPercent: body.waterContentPercent,
          ffaPercent: body.ffaPercent,
          impurityPercent: body.impurityPercent,
          grade: body.grade,
          notes: body.notes,
          testedById: req.user.id,
        },
      });

      await writeAuditLog(tx, {
        req,
        actorId: req.user.id,
        entityType: AUDIT_ENTITY_TYPES.LAB_RESULT,
        entityId: labResult.id,
        action: AUDIT_ACTIONS.UPDATE,
        before: labResult,
        after: savedLabResult,
        reason: body.notes,
      });
    });

    res.json({ labResult: updatedLabResult });
  } catch (error) {
    next(error);
  }
}

async function deleteLabResult(req, res, next) {
  try {
    const labResult = await prisma.labResult.findUnique({
      where: { id: req.params.id },
    });

    if (!labResult) {
      throw new ApiError(404, "Lab result not found");
    }

    await ensureEditableBatch(labResult.batchId);
    await prisma.$transaction(async (tx) => {
      await tx.labResult.delete({ where: { id: labResult.id } });

      await writeAuditLog(tx, {
        req,
        actorId: req.user.id,
        entityType: AUDIT_ENTITY_TYPES.LAB_RESULT,
        entityId: labResult.id,
        action: AUDIT_ACTIONS.DELETE,
        before: labResult,
        after: null,
        reason: req.body?.reason,
      });
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createLabResult,
  deleteLabResult,
  getLabResultByBatch,
  updateLabResult,
};
