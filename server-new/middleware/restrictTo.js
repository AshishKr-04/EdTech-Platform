const AppError = require("./AppError");

/**
 * Reusable authorization middleware to restrict endpoint access to specific roles.
 * @param  {...string} allowedRoles - List of allowed roles (e.g. 'Instructor', 'Admin')
 */
const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

module.exports = restrictTo;
