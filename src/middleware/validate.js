const ApiError = require('../utils/ApiError');

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const message = result.error.issues.map((issue) => issue.message).join(', ');
      next(new ApiError(400, message));
      return;
    }

    req.validated = result.data;
    next();
  };
}

module.exports = { validate };
