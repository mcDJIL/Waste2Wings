const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HenWasteOil API',
      version: '1.0.0',
      description: 'REST API documentation for HenWasteOil backend.',
    },
    servers: [
      {
        url: '/api/v1',
        description: 'API v1',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Invalid email or password',
                },
                statusCode: {
                  type: 'integer',
                  example: 401,
                },
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'clx123user001',
            },
            name: {
              type: 'string',
              example: 'Community One',
            },
            email: {
              type: 'string',
              example: 'community1@hen.test',
            },
            role: {
              type: 'string',
              enum: ['COMMUNITY', 'COLLECTOR', 'STAKEHOLDER'],
              example: 'COMMUNITY',
            },
            phone: {
              type: 'string',
              nullable: true,
              example: '081234567890',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User',
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
          },
        },
      },
    },
  },
  apis: ['./src/**/*.js'],
});

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = { setupSwagger };
