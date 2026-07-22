const express = require('express');

const {
  getDashboardMap,
  getDashboardSummary,
  getDashboardTrends,
} = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { ROLES } = require('../utils/status');

const router = express.Router();

/**
 * @openapi
 * /dashboard/summary:
 *   get:
 *     summary: Get stakeholder dashboard summary
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Aggregated supply chain metrics
 *       403:
 *         description: Only stakeholder can access dashboard
 */
router.get('/summary', authenticate, authorize(ROLES.STAKEHOLDER), getDashboardSummary);

/**
 * @openapi
 * /dashboard/map:
 *   get:
 *     summary: Get map markers for communities and collectors
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Marker data for frontend map rendering
 *       403:
 *         description: Only stakeholder can access dashboard
 */
router.get('/map', authenticate, authorize(ROLES.STAKEHOLDER), getDashboardMap);

/**
 * @openapi
 * /dashboard/trends:
 *   get:
 *     summary: Get monthly accepted volume and purchase trends
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly volume and price trend data
 *       403:
 *         description: Only stakeholder can access dashboard
 */
router.get('/trends', authenticate, authorize(ROLES.STAKEHOLDER), getDashboardTrends);

module.exports = router;
