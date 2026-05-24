const AppError = require("./AppError");
const { objectIdSchema } = require("../utils/validationSchemas");

const validate = (schema) => (req, res, next) => {
  try {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      // Standardize the error response fields
      const issues = result.error.issues || result.error.errors || [];
      const errors = issues.map((err) => {
        // e.g., err.path is ['body', 'email']. We slice the leading block (e.g. 'body')
        const fieldPath = err.path.length > 1 ? err.path.slice(1).join(".") : err.path[0];
        return {
          field: fieldPath,
          message: err.message,
        };
      });

      return next(new AppError("Validation failed", 400, errors));
    }

    // Re-assign parsed and sanitized inputs
    if (result.data.body) req.body = result.data.body;
    if (result.data.params) req.params = result.data.params;
    if (result.data.query) req.query = result.data.query;

    next();
  } catch (err) {
    next(err);
  }
};

const validateIdParam = (paramName = "id") => (req, res, next) => {
  const result = objectIdSchema.safeParse(req.params[paramName]);
  if (!result.success) {
    return next(
      new AppError(
        `Invalid ${paramName} parameter. Must be a 24-character hexadecimal ObjectId.`,
        400
      )
    );
  }
  next();
};

module.exports = {
  validate,
  validateIdParam,
};
