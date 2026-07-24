const prisma = require('../prismaClient');

async function getAuditLogs(req, res, next) {
  try {
    const where = {};

    if (req.query.entityType) {
      where.entityType = req.query.entityType;
    }
    if (req.query.entityId) {
      where.entityId = req.query.entityId;
    }
    if (req.query.action) {
      where.action = req.query.action;
    }

    const limit = Math.min(Number(req.query.limit) || 50, 100) // limit data size to 100
    const auditLogs = await prisma.auditLog.findMany({
      where,
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })
  } catch (error) {
    next(error);
  }
}

module.exports = { getAuditLogs };