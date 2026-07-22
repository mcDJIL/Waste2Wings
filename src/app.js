const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const { notFoundHandler, errorHandler } = require('./middleware/error');
const authRoutes = require('./routes/auth.routes');
const collectorRoutes = require('./routes/collector.routes');
const profileRoutes = require('./routes/profile.routes');
const stakeholderRoutes = require('./routes/stakeholder.routes');
const { setupSwagger } = require('./swagger');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

setupSwagger(app);

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Check API health
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is running
 */
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'henwasteoil-be',
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/collectors', collectorRoutes);
app.use('/api/v1/profiles', profileRoutes);
app.use('/api/v1/stakeholder', stakeholderRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
