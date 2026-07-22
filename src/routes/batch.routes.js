const express = require('express');
const { z } = require('zod');

const { createBatch, getBatchById, getBatches } = require('../controllers/batch.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validate } = require('../middleware/validate');
const { BATCH_STATUS, ROLES } = require('../utils/status');

const router = express.Router();

const createBatchSchema = z.object({
  body: z.object({
    submissionIds: z.array(z.string().min(1)).min(1),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

const listBatchSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    status: z
      .enum([
        BATCH_STATUS.SUBMITTED_TO_STAKEHOLDER,
        BATCH_STATUS.LAB_REVIEW,
        BATCH_STATUS.ACCEPTED_BY_STAKEHOLDER,
        BATCH_STATUS.REJECTED_BY_STAKEHOLDER,
      ])
      .optional(),
  }),
});

const paramsSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1),
  }),
});

/**
 * @openapi
 * /batches:
 *   post:
 *     summary: Create collector batch from accepted community submissions
 *     tags:
 *       - Batches
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [submissionIds]
 *             properties:
 *               submissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [clxsubmission001, clxsubmission002]
 *     responses:
 *       201:
 *         description: Created batch and moved submissions to IN_BATCH
 *       400:
 *         description: Invalid submissions or stakeholder setting missing
 *       401:
 *         description: Missing or invalid JWT token
 *       403:
 *         description: Only collector can create batch
 */
router.post('/', authenticate, authorize(ROLES.COLLECTOR), validate(createBatchSchema), createBatch);

/**
 * @openapi
 * /batches:
 *   get:
 *     summary: List collector batches by current role
 *     tags:
 *       - Batches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SUBMITTED_TO_STAKEHOLDER, LAB_REVIEW, ACCEPTED_BY_STAKEHOLDER, REJECTED_BY_STAKEHOLDER]
 *     responses:
 *       200:
 *         description: Batches visible to current user role
 */
router.get('/', authenticate, validate(listBatchSchema), getBatches);

/**
 * @openapi
 * /batches/{id}:
 *   get:
 *     summary: Get collector batch detail
 *     tags:
 *       - Batches
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Batch detail with submissions
 *       403:
 *         description: Batch is not visible to current user
 *       404:
 *         description: Batch not found
 */
router.get('/:id', authenticate, validate(paramsSchema), getBatchById);

module.exports = router;
