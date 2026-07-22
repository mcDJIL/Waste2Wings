const express = require('express');
const { z } = require('zod');

const { login, me, register } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { ROLES } = require('../utils/status');

const router = express.Router();

const coordinateSchema = {
  address: z.string().min(3),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
};

const registerSchema = z.object({
  body: z.discriminatedUnion('role', [
    z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8),
      role: z.literal(ROLES.COMMUNITY),
      phone: z.string().optional(),
      profile: z.object({
        category: z.enum(['HOUSEHOLD', 'UMKM', 'HOTEL_RESTAURANT', 'INDUSTRY']),
        ...coordinateSchema,
      }),
    }),
    z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8),
      role: z.literal(ROLES.COLLECTOR),
      phone: z.string().optional(),
      profile: z.object({
        companyName: z.string().min(2),
        capacityLiter: z.number().positive(),
        buyPricePerLiter: z.number().nonnegative().optional(),
        ...coordinateSchema,
      }),
    }),
    z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8),
      role: z.literal(ROLES.STAKEHOLDER),
      phone: z.string().optional(),
      profile: z.object({
        companyName: z.string().min(2),
        address: z.string().optional(),
      }),
    }),
  ]),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a user and role profile
 *     description: Register one of the three RBAC roles. The `profile` shape depends on `role`.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 required: [name, email, password, role, profile]
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Community One
 *                   email:
 *                     type: string
 *                     example: community1@hen.test
 *                   password:
 *                     type: string
 *                     example: password123
 *                   role:
 *                     type: string
 *                     enum: [COMMUNITY]
 *                     example: COMMUNITY
 *                   phone:
 *                     type: string
 *                     example: '081234567890'
 *                   profile:
 *                     type: object
 *                     required: [category, address, latitude, longitude]
 *                     properties:
 *                       category:
 *                         type: string
 *                         enum: [HOUSEHOLD, UMKM, HOTEL_RESTAURANT, INDUSTRY]
 *                         example: HOUSEHOLD
 *                       address:
 *                         type: string
 *                         example: Jakarta Selatan
 *                       latitude:
 *                         type: number
 *                         example: -6.2615
 *                       longitude:
 *                         type: number
 *                         example: 106.8106
 *               - type: object
 *                 required: [name, email, password, role, profile]
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Collector One
 *                   email:
 *                     type: string
 *                     example: collector1@hen.test
 *                   password:
 *                     type: string
 *                     example: password123
 *                   role:
 *                     type: string
 *                     enum: [COLLECTOR]
 *                     example: COLLECTOR
 *                   phone:
 *                     type: string
 *                     example: '081234567891'
 *                   profile:
 *                     type: object
 *                     required: [companyName, address, latitude, longitude, capacityLiter]
 *                     properties:
 *                       companyName:
 *                         type: string
 *                         example: Pengepul Hijau 1
 *                       address:
 *                         type: string
 *                         example: Jakarta Timur
 *                       latitude:
 *                         type: number
 *                         example: -6.225
 *                       longitude:
 *                         type: number
 *                         example: 106.9004
 *                       capacityLiter:
 *                         type: number
 *                         example: 1000
 *                       buyPricePerLiter:
 *                         type: number
 *                         example: 8000
 *               - type: object
 *                 required: [name, email, password, role, profile]
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: HEN Admin
 *                   email:
 *                     type: string
 *                     example: stakeholder@hen.test
 *                   password:
 *                     type: string
 *                     example: password123
 *                   role:
 *                     type: string
 *                     enum: [STAKEHOLDER]
 *                     example: STAKEHOLDER
 *                   phone:
 *                     type: string
 *                     example: '081234567892'
 *                   profile:
 *                     type: object
 *                     required: [companyName]
 *                     properties:
 *                       companyName:
 *                         type: string
 *                         example: PT Hijau Energi Nusantara
 *                       address:
 *                         type: string
 *                         example: Jakarta
 *           examples:
 *             community:
 *               summary: Community registration
 *               value:
 *                 name: Community One
 *                 email: community1@hen.test
 *                 password: password123
 *                 role: COMMUNITY
 *                 phone: '081234567890'
 *                 profile:
 *                   category: HOUSEHOLD
 *                   address: Jakarta Selatan
 *                   latitude: -6.2615
 *                   longitude: 106.8106
 *             collector:
 *               summary: Collector registration
 *               value:
 *                 name: Collector One
 *                 email: collector1@hen.test
 *                 password: password123
 *                 role: COLLECTOR
 *                 phone: '081234567891'
 *                 profile:
 *                   companyName: Pengepul Hijau 1
 *                   address: Jakarta Timur
 *                   latitude: -6.225
 *                   longitude: 106.9004
 *                   capacityLiter: 1000
 *                   buyPricePerLiter: 8000
 *             stakeholder:
 *               summary: Stakeholder registration
 *               value:
 *                 name: HEN Admin
 *                 email: stakeholder@hen.test
 *                 password: password123
 *                 role: STAKEHOLDER
 *                 phone: '081234567892'
 *                 profile:
 *                   companyName: PT Hijau Energi Nusantara
 *                   address: Jakarta
 *     responses:
 *       201:
 *         description: Registered user and JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               user:
 *                 id: clx123user001
 *                 name: Community One
 *                 email: community1@hen.test
 *                 role: COMMUNITY
 *                 phone: '081234567890'
 *                 createdAt: '2026-06-22T08:25:00.000Z'
 *                 updatedAt: '2026-06-22T08:25:00.000Z'
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid request payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error:
 *                 message: String must contain at least 8 character(s)
 *                 statusCode: 400
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error:
 *                 message: Email is already registered
 *                 statusCode: 409
 */
router.post('/register', validate(registerSchema), register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login and receive a JWT token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: community1@hen.test
 *               password:
 *                 type: string
 *                 example: password123
 *           examples:
 *             community:
 *               summary: Community login
 *               value:
 *                 email: community1@hen.test
 *                 password: password123
 *             collector:
 *               summary: Collector login
 *               value:
 *                 email: collector1@hen.test
 *                 password: password123
 *             stakeholder:
 *               summary: Stakeholder login
 *               value:
 *                 email: stakeholder@hen.test
 *                 password: password123
 *     responses:
 *       200:
 *         description: Authenticated user and JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *             example:
 *               user:
 *                 id: clx123user001
 *                 name: Community One
 *                 email: community1@hen.test
 *                 role: COMMUNITY
 *                 phone: '081234567890'
 *                 createdAt: '2026-06-22T08:25:00.000Z'
 *                 updatedAt: '2026-06-22T08:25:00.000Z'
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid request payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error:
 *                 message: Invalid email
 *                 statusCode: 400
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error:
 *                 message: Invalid email or password
 *                 statusCode: 401
 */
router.post('/login', validate(loginSchema), login);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *             example:
 *               user:
 *                 id: clx123user001
 *                 name: Community One
 *                 email: community1@hen.test
 *                 role: COMMUNITY
 *                 phone: '081234567890'
 *                 createdAt: '2026-06-22T08:25:00.000Z'
 *                 updatedAt: '2026-06-22T08:25:00.000Z'
 *       401:
 *         description: Missing or invalid JWT token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               missingToken:
 *                 summary: Missing token
 *                 value:
 *                   error:
 *                     message: Authentication token is required
 *                     statusCode: 401
 *               invalidToken:
 *                 summary: Invalid token
 *                 value:
 *                   error:
 *                     message: Invalid or expired authentication token
 *                     statusCode: 401
 */
router.get('/me', authenticate, me);

module.exports = router;
