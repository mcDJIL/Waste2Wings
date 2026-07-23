const express = require('express');
const { z } = require('zod');

const {
  createSubmission,
  getSubmissionById,
  getSubmissions,
  validateSubmissionByCollector,
} = require('../controllers/submission.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validate } = require('../middleware/validate');
const { ROLES, SUBMISSION_STATUS } = require('../utils/status');

const router = express.Router();

const createSubmissionSchema = z.object({
  body: z.object({
    collectorId: z.string().min(1),
    estimatedLiter: z.number().positive(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

const listSubmissionSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    status: z
      .enum([
        SUBMISSION_STATUS.SUBMITTED,
        SUBMISSION_STATUS.ACCEPTED_BY_COLLECTOR,
        SUBMISSION_STATUS.REJECTED_BY_COLLECTOR,
        SUBMISSION_STATUS.IN_BATCH,
        SUBMISSION_STATUS.COMPLETED,
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

const collectorValidationSchema = z.object({
  body: z.discriminatedUnion('status', [
    z.object({
      status: z.literal(SUBMISSION_STATUS.ACCEPTED_BY_COLLECTOR),
      actualLiter: z.number().positive(),
      sedimentLiter: z.number().nonnegative(),
      collectorNote: z.string().optional(),
    }),
    z.object({
      status: z.literal(SUBMISSION_STATUS.REJECTED_BY_COLLECTOR),
      collectorNote: z.string().optional(),
    }),
  ]),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1),
  }),
});

/**
 * @openapi
 * /submissions:
 *   post:
 *     summary: Create community oil submission request
 *     tags:
 *       - Submissions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [collectorId, estimatedLiter]
 *             properties:
 *               collectorId:
 *                 type: string
 *                 example: clxcollectorprofile001
 *               estimatedLiter:
 *                 type: number
 *                 example: 25
 *     responses:
 *       201:
 *         description: Created submission
 *       401:
 *         description: Missing or invalid JWT token
 *       403:
 *         description: Only community can create submission
 *       404:
 *         description: Active collector not found
 */
router.post('/', authenticate, authorize(ROLES.COMMUNITY), validate(createSubmissionSchema), createSubmission);

/**
 * @openapi
 * /submissions:
 *   get:
 *     summary: List submissions by current role
 *     tags:
 *       - Submissions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [SUBMITTED, ACCEPTED_BY_COLLECTOR, REJECTED_BY_COLLECTOR, IN_BATCH, COMPLETED]
 *     responses:
 *       200:
 *         description: Submissions visible to current user role
 */
router.get('/', authenticate, validate(listSubmissionSchema), getSubmissions);

/**
 * @openapi
 * /submissions/{id}:
 *   get:
 *     summary: Get submission detail
 *     tags:
 *       - Submissions
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
 *         description: Submission detail
 *       403:
 *         description: Submission is not visible to current user
 *       404:
 *         description: Submission not found
 */
router.get('/:id', authenticate, validate(paramsSchema), getSubmissionById);

/**
 * @openapi
 * /submissions/{id}/collector-validation:
 *   patch:
 *     summary: Accept or reject community submission by collector
 *     tags:
 *       - Submissions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required: [status, actualLiter, sedimentLiter]
 *                 properties:
 *                   status:
 *                     type: string
 *                     enum: [ACCEPTED_BY_COLLECTOR]
 *                   actualLiter:
 *                     type: number
 *                     example: 24
 *                   sedimentLiter:
 *                     type: number
 *                     example: 1.5
 *                   collectorNote:
 *                     type: string
 *                     example: Accepted after filtering sediment.
 *               - type: object
 *                 required: [status]
 *                 properties:
 *                   status:
 *                     type: string
 *                     enum: [REJECTED_BY_COLLECTOR]
 *                   collectorNote:
 *                     type: string
 *                     example: Oil quality is too poor.
 *           examples:
 *             accept:
 *               summary: Accept submission
 *               value:
 *                 status: ACCEPTED_BY_COLLECTOR
 *                 actualLiter: 24
 *                 sedimentLiter: 1.5
 *                 collectorNote: Accepted after filtering sediment.
 *             reject:
 *               summary: Reject submission
 *               value:
 *                 status: REJECTED_BY_COLLECTOR
 *                 collectorNote: Oil quality is too poor.
 *     responses:
 *       200:
 *         description: Validated submission
 *       400:
 *         description: Invalid status transition or payload
 *       403:
 *         description: Only assigned collector can validate
 *       404:
 *         description: Submission not found
 */
router.patch(
  '/:id/collector-validation',
  authenticate,
  authorize(ROLES.COLLECTOR),
  validate(collectorValidationSchema),
  validateSubmissionByCollector,
);

module.exports = router;
