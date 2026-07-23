const express = require('express');
const { z } = require('zod');

const {
  getCollectors,
  getNearbyCollectors,
  updateMyCollectorPrice,
} = require('../controllers/collector.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validate } = require('../middleware/validate');
const { ROLES } = require('../utils/status');

const router = express.Router();

const listCollectorsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    q: z.string().trim().min(1).optional(),
  }),
});

const nearbySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
    limit: z.coerce.number().int().positive().max(50).optional(),
  }),
});

const updatePriceSchema = z.object({
  body: z.object({
    buyPricePerLiter: z.number().positive(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

/**
 * @openapi
 * /collectors:
 *   get:
 *     summary: List active collectors
 *     tags:
 *       - Collectors
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         description: Search by collector company name, address, or user name
 *         schema:
 *           type: string
 *         example: Tebet
 *     responses:
 *       200:
 *         description: Active collectors with price and location data
 */
router.get('/', validate(listCollectorsSchema), getCollectors);

/**
 * @openapi
 * /collectors/nearby:
 *   get:
 *     summary: List nearest active collectors by haversine distance
 *     tags:
 *       - Collectors
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *         example: -6.2615
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *         example: 106.8106
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         example: 5
 *     responses:
 *       200:
 *         description: Nearest collectors sorted by distance
 *       400:
 *         description: Invalid query parameter
 */
router.get('/nearby', validate(nearbySchema), getNearbyCollectors);

/**
 * @openapi
 * /collectors/me/price:
 *   patch:
 *     summary: Set or update current collector buy price per liter.
 *     tags:
 *       - Collectors
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [buyPricePerLiter]
 *             properties:
 *               buyPricePerLiter:
 *                 type: number
 *                 example: 8500
 *     responses:
 *       200:
 *         description: Updated collector price
 *       400:
 *         description: Price exceeds stakeholder reference price or invalid payload
 *       401:
 *         description: Missing or invalid JWT token
 *       403:
 *         description: Only collector can update collector price
 */
router.patch(
  '/me/price',
  authenticate,
  authorize(ROLES.COLLECTOR),
  validate(updatePriceSchema),
  updateMyCollectorPrice,
);

module.exports = router;
