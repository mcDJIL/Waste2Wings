const express = require('express');
const { z } = require('zod');

const {
  createLabResult,
  deleteLabResult,
  getLabResultByBatch,
  updateLabResult,
} = require('../controllers/lab.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validate } = require('../middleware/validate');
const { LAB_GRADES, ROLES } = require('../utils/status');

const router = express.Router();

const labBodySchema = z.object({
  waterContentPercent: z.number().min(0).max(100),
  ffaPercent: z.number().min(0).max(100),
  impurityPercent: z.number().min(0).max(100),
  grade: z.enum([LAB_GRADES.A, LAB_GRADES.B, LAB_GRADES.C, LAB_GRADES.REJECT]),
  notes: z.string().optional(),
});

const createLabSchema = z.object({
  body: labBodySchema,
  query: z.object({}).optional(),
  params: z.object({
    batchId: z.string().min(1),
  }),
});

const updateLabSchema = z.object({
  body: labBodySchema,
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1),
  }),
});

const batchParamsSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    batchId: z.string().min(1),
  }),
});

const labParamsSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1),
  }),
});

/**
 * @openapi
 * /batches/{batchId}/lab-results:
 *   post:
 *     summary: Create lab result for a collector batch
 *     tags:
 *       - Lab Results
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [waterContentPercent, ffaPercent, impurityPercent, grade]
 *             properties:
 *               waterContentPercent:
 *                 type: number
 *                 example: 0.8
 *               ffaPercent:
 *                 type: number
 *                 example: 2.1
 *               impurityPercent:
 *                 type: number
 *                 example: 0.5
 *               grade:
 *                 type: string
 *                 enum: [A, B, C, REJECT]
 *                 example: A
 *               notes:
 *                 type: string
 *                 example: Quality is acceptable for SAF feedstock.
 *     responses:
 *       201:
 *         description: Created lab result
 *       400:
 *         description: Invalid payload or batch already final
 *       403:
 *         description: Only stakeholder can create lab result
 *       404:
 *         description: Batch not found
 *       409:
 *         description: Lab result already exists
 */
router.post(
  '/batches/:batchId/lab-results',
  authenticate,
  authorize(ROLES.STAKEHOLDER),
  validate(createLabSchema),
  createLabResult,
);

/**
 * @openapi
 * /batches/{batchId}/lab-results:
 *   get:
 *     summary: Get lab result for a collector batch
 *     tags:
 *       - Lab Results
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lab result or null
 */
router.get('/batches/:batchId/lab-results', authenticate, validate(batchParamsSchema), getLabResultByBatch);

/**
 * @openapi
 * /lab-results/{id}:
 *   patch:
 *     summary: Update lab result before final batch validation
 *     tags:
 *       - Lab Results
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Updated lab result
 */
router.patch(
  '/lab-results/:id',
  authenticate,
  authorize(ROLES.STAKEHOLDER),
  validate(updateLabSchema),
  updateLabResult,
);

/**
 * @openapi
 * /lab-results/{id}:
 *   delete:
 *     summary: Delete lab result before final batch validation
 *     tags:
 *       - Lab Results
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Deleted lab result
 */
router.delete(
  '/lab-results/:id',
  authenticate,
  authorize(ROLES.STAKEHOLDER),
  validate(labParamsSchema),
  deleteLabResult,
);

module.exports = router;
