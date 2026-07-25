function getRequestMeta(req) {
  return {
    ipAddress: req.ip || req.headers["x-forwarded-for"] || null,
    userAgent: req.headers["user-agent"] || null,
  };
}

async function writeAuditLog(
  tx,
  { req, actorId, entityType, entityId, action, before, after, reason },
) {
  const meta = req ? getRequestMeta(req) : { ipAddress: null, userAgent: null };

  return tx.auditLog.create({
    data: {
      actorId: actorId || null,
      entityType,
      entityId,
      action,
      before: before || undefined,
      after: after || undefined,
      reason: reason || null,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    },
  });
}

module.exports = { writeAuditLog };
