const express = require('express');
const { z } = require('zod');

const {
  getStakeholderSetting,
  upsertStakeholderSetting,
} = require('../controllers/stakeholder.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validate } = require('../middleware/validate');
const { ROLES } = require('../utils/status');

const router = express.Router();

const settingSchema = z.object({
  body: z.object({
    referencePricePerLiter: z.number().positive(),
    receptionLocationName: z.string().min(2),
    receptionAddress: z.string().min(3),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

/**
 * @openapi
 * /stakeholder/settings:
 *   get:
 *     summary: Get active stakeholder price and reception setting
 *     tags:
 *       - Stakeholder Settings
 *     responses:
 *       200:
 *         description: Active stakeholder setting, or null if not configured
 */
router.get('/settings', getStakeholderSetting);

/**
 * @openapi
 * /stakeholder/settings:
 *   put:
 *     summary: Create or update stakeholder price and reception setting
 *     tags:
 *       - Stakeholder Settings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [referencePricePerLiter, receptionLocationName, receptionAddress, latitude, longitude]
 *             properties:
 *               referencePricePerLiter:
 *                 type: number
 *                 example: 10000
 *               receptionLocationName:
 *                 type: string
 *                 example: HEN Jakarta Reception Plant
 *               receptionAddress:
 *                 type: string
 *                 example: Kawasan Industri Pulogadung, Jakarta
 *               latitude:
 *                 type: number
 *                 example: -6.1917
 *               longitude:
 *                 type: number
 *                 example: 106.8926
 *     responses:
 *       200:
 *         description: Created or updated setting
 *       400:
 *         description: Invalid request payload
 *       401:
 *         description: Missing or invalid JWT token
 *       403:
 *         description: Only stakeholder can update setting
 */
router.put(
  '/settings',
  authenticate,
  authorize(ROLES.STAKEHOLDER),
  validate(settingSchema),
  upsertStakeholderSetting,
);

module.exports = router;
