const express = require('express');
const { z } = require('zod');

const { getAuditLogs } = require('../controllers/audit.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validate } = require('../middleware/validate');
const { AUDIT_ACTIONS, AUDIT_ENTITY_TYPES, ROLES } = require('../utils/status');

const router = express.Router();

const listAuditSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    entityType: z
      .enum([
        AUDIT_ENTITY_TYPES.STAKEHOLDER_SETTING,
        AUDIT_ENTITY_TYPES.COMMUNITY_SUBMISSION,
        AUDIT_ENTITY_TYPES.COLLECTOR_BATCH,
        AUDIT_ENTITY_TYPES.LAB_RESULT,
      ])
      .optional(),
    entityId: z.string().optional(),
    action: z
      .enum([
        AUDIT_ACTIONS.CREATE,
        AUDIT_ACTIONS.UPDATE,
        AUDIT_ACTIONS.DELETE,
        AUDIT_ACTIONS.ACCEPT,
        AUDIT_ACTIONS.REJECT,
        AUDIT_ACTIONS.FINAL_VALIDATE,
        AUDIT_ACTIONS.CORRECTION,
      ])
      .optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

/**
 * @openapi
 * /audit-logs:
 *   get:
 *     summary: List audit logs
 *     tags:
 *       - Audit Logs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: entityType
 *         schema:
 *           type: string
 *           enum: [STAKEHOLDER_SETTING, COMMUNITY_SUBMISSION, COLLECTOR_BATCH, LAB_RESULT]
 *       - in: query
 *         name: entityId
 *         schema:
 *           type: string
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum: [CREATE, UPDATE, DELETE, ACCEPT, REJECT, FINAL_VALIDATE, CORRECTION]
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       200:
 *         description: Audit logs
 *       403:
 *         description: Only stakeholder can access audit logs
 */
router.get(
  '/',
  authenticate,
  authorize(ROLES.STAKEHOLDER),
  validate(listAuditSchema),
  getAuditLogs,
);

module.exports = router;