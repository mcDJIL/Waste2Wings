const express = require('express');
const { z } = require('zod');

const {
  getCollectorClusterAreas,
  getCollectorClusteringModelInfo,
  getFundingPredictionModelInfo,
  predictCollectorCluster,
  predictFunding,
  recommendCollectorArea,
  trainCollectorClustering,
  trainFundingPrediction,
} = require('../controllers/prediction.controller');
const { authenticate } = require('../middleware/auth');
const { authorize } = require('../middleware/role');
const { validate } = require('../middleware/validate');
const { ROLES } = require('../utils/status');

const router = express.Router();

const optionalDataPathSchema = z.object({
  body: z.object({
    data_path: z.string().min(1).optional(),
  }).optional(),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

const fundingPredictionSchema = z.object({
  body: z.object({
    reference_price: z.number().positive().optional(),
  }).optional().default({}),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

const coordinateSchema = z.object({
  body: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

/**
 * @openapi
 * /predictions/funding/train:
 *   post:
 *     summary: Train ML fund prediction model
 *     tags:
 *       - Predictions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data_path:
 *                 type: string
 *                 example: data/waste_oil_dummy.csv
 *     responses:
 *       200:
 *         description: ML training result
 */
router.post(
  '/funding/train',
  authenticate,
  authorize(ROLES.STAKEHOLDER),
  validate(optionalDataPathSchema),
  trainFundingPrediction,
);

/**
 * @openapi
 * /predictions/funding/predict:
 *   post:
 *     summary: Predict next period purchase fund need
 *     tags:
 *       - Predictions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reference_price:
 *                 type: number
 *                 example: 13000
 *     responses:
 *       200:
 *         description: ML prediction result
 *       400:
 *         description: Missing stakeholder reference price
 *       502:
 *         description: ML service request failed
 */
router.post(
  '/funding/predict',
  authenticate,
  authorize(ROLES.STAKEHOLDER),
  validate(fundingPredictionSchema),
  predictFunding,
);

/**
 * @openapi
 * /predictions/funding/model-info:
 *   get:
 *     summary: Get fund prediction model info
 *     tags:
 *       - Predictions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ML model info
 */
router.get(
  '/funding/model-info',
  authenticate,
  authorize(ROLES.STAKEHOLDER),
  getFundingPredictionModelInfo,
);

/**
 * @openapi
 * /predictions/collector-area/train:
 *   post:
 *     summary: Train ML collector area clustering model
 *     tags:
 *       - Predictions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data_path:
 *                 type: string
 *                 example: data/collector_locations_dummy.csv
 *     responses:
 *       200:
 *         description: ML training result
 */
router.post(
  '/collector-area/train',
  authenticate,
  authorize(ROLES.STAKEHOLDER),
  validate(optionalDataPathSchema),
  trainCollectorClustering,
);

/**
 * @openapi
 * /predictions/collector-area/recommend:
 *   post:
 *     summary: Recommend strategic collector area from coordinates
 *     tags:
 *       - Predictions
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [latitude, longitude]
 *             properties:
 *               latitude:
 *                 type: number
 *                 example: -6.22
 *               longitude:
 *                 type: number
 *                 example: 106.89
 *     responses:
 *       200:
 *         description: ML clustering recommendation
 *       502:
 *         description: ML service request failed
 */
router.post(
  '/collector-area/recommend',
  authenticate,
  authorize(ROLES.STAKEHOLDER),
  validate(coordinateSchema),
  recommendCollectorArea,
);

/**
 * @openapi
 * /predictions/collector-area/predict:
 *   post:
 *     summary: Predict cluster for coordinates
 *     tags:
 *       - Predictions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Predicted cluster
 */
router.post(
  '/collector-area/predict',
  authenticate,
  authorize(ROLES.STAKEHOLDER),
  validate(coordinateSchema),
  predictCollectorCluster,
);

/**
 * @openapi
 * /predictions/collector-area/areas:
 *   get:
 *     summary: Get all ML collector cluster areas
 *     tags:
 *       - Predictions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cluster areas
 */
router.get(
  '/collector-area/areas',
  authenticate,
  authorize(ROLES.STAKEHOLDER),
  getCollectorClusterAreas,
);

/**
 * @openapi
 * /predictions/collector-area/model-info:
 *   get:
 *     summary: Get collector clustering model info
 *     tags:
 *       - Predictions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ML model info
 */
router.get(
  '/collector-area/model-info',
  authenticate,
  authorize(ROLES.STAKEHOLDER),
  getCollectorClusteringModelInfo,
);

module.exports = router;
