import jwt from "jsonwebtoken";
import AppError from "./AppError.js";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return next(new AppError("No token provided. Please log in first.", 401));
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return next(new AppError("Malformed authorization header. Scheme must be Bearer.", 401));
    }

    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    // Forward JWT errors (JsonWebTokenError, TokenExpiredError) directly to the errorHandler
    next(err);
  }
};

export default authMiddleware;