const express = require('express');
const { z } = require('zod');

const { getMyProfile, updateMyProfile } = require('../controllers/profile.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { ROLES } = require('../utils/status');

const router = express.Router();

const coordinateSchema = {
  address: z.string().min(3).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
};

const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
    profile: z
      .object({
        category: z.enum(['HOUSEHOLD', 'UMKM', 'HOTEL_RESTAURANT', 'INDUSTRY']).optional(),
        companyName: z.string().min(2).optional(),
        capacityLiter: z.number().positive().optional(),
        buyPricePerLiter: z.number().nonnegative().optional(),
        isActive: z.boolean().optional(),
        ...coordinateSchema,
      })
      .optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

/**
 * @openapi
 * /profiles/me:
 *   get:
 *     summary: Get current user profile
 *     tags:
 *       - Profiles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user and role profile
 *       401:
 *         description: Missing or invalid JWT token
 */
router.get('/me', authenticate, getMyProfile);

/**
 * @openapi
 * /profiles/me:
 *   patch:
 *     summary: Update current user profile
 *     tags:
 *       - Profiles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             name: Community One Updated
 *             phone: '081234567899'
 *             profile:
 *               address: Jakarta Selatan
 *               latitude: -6.2615
 *               longitude: 106.8106
 *     responses:
 *       200:
 *         description: Updated user and role profile
 *       400:
 *         description: Invalid request payload
 *       401:
 *         description: Missing or invalid JWT token
 */
router.patch('/me', authenticate, validate(updateProfileSchema), updateMyProfile);

module.exports = router;
