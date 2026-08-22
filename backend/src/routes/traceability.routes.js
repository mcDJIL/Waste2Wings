const express = require('express');
const { getTraceabilityByCode } = require('../controllers/traceability.controller');

const router = express.Router();

/**
 * Public route for QR Code / Traceability Lookup
 * GET /api/v1/traceability/:code
 */
router.get('/:code', getTraceabilityByCode);

module.exports = router;
