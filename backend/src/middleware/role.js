const ApiError = require('../utils/ApiError');

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      next(new ApiError(401, 'Authentication is required'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new ApiError(403, 'You do not have permission to access this resource'));
      return;
    }

    next();
  };
}

module.exports = { authorize };
