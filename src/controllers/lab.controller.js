const ApiError = require('../utils/ApiError');
const prisma = require('../prismaClient');
const { BATCH_STATUS } = require('../utils/status');

async function ensureEditableBatch(batchId) {
  const batch = await prisma.collectorBatch.findUnique({ where: { id: batchId } });

  if (!batch) {
    throw new ApiError(404, 'Batch not found');
  }

  if ([BATCH_STATUS.ACCEPTED_BY_STAKEHOLDER, BATCH_STATUS.REJECTED_BY_STAKEHOLDER].includes(batch.status)) {
    throw new ApiError(400, 'Lab result cannot be changed after final stakeholder validation');
  }

  return batch;
}

async function createLabResult(req, res, next) {
  try {
    const { body } = req.validated;
    const batch = await ensureEditableBatch(req.params.batchId);
    const existingLabResult = await prisma.labResult.findUnique({ where: { batchId: batch.id } });

    if (existingLabResult) {
      throw new ApiError(409, 'Lab result already exists for this batch');
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
    const labResult = await prisma.labResult.findUnique({ where: { id: req.params.id } });

    if (!labResult) {
      throw new ApiError(404, 'Lab result not found');
    }

    await ensureEditableBatch(labResult.batchId);

    const updatedLabResult = await prisma.labResult.update({
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

    res.json({ labResult: updatedLabResult });
  } catch (error) {
    next(error);
  }
}

async function deleteLabResult(req, res, next) {
  try {
    const labResult = await prisma.labResult.findUnique({ where: { id: req.params.id } });

    if (!labResult) {
      throw new ApiError(404, 'Lab result not found');
    }

    await ensureEditableBatch(labResult.batchId);
    await prisma.labResult.delete({ where: { id: labResult.id } });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = { createLabResult, deleteLabResult, getLabResultByBatch, updateLabResult };
