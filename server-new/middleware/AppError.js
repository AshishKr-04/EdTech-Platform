class AppError extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // Indicates it is a predicted client/operational error
    this.errors = errors; // Specific fields that failed validation

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
