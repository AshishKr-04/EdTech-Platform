import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import authRouter from "./routes/auth.js";
import coursesRouter from "./routes/courses.js";
import usersRouter from "./routes/users.js";
import uploadRouter from "./routes/upload.js";
import paymentsRouter from "./routes/payments.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(helmet());

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: {
    status: "fail",
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    status: "fail",
    message: "Too many authentication attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

const allowedOrigins = [];

if (process.env.NODE_ENV === "production") {
  if (process.env.ALLOWED_ORIGINS) {
    allowedOrigins.push(
      ...process.env.ALLOWED_ORIGINS.split(",")
        .map((o) => o.trim())
        .filter(Boolean)
    );
  }
  if (process.env.CLIENT_URL) allowedOrigins.push(process.env.CLIENT_URL.trim());
  if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL.trim());
} else {
  allowedOrigins.push(
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5000",
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL
  );
}

const cleanAllowedOrigins = allowedOrigins
  .map((origin) => origin && origin.trim())
  .filter(Boolean);

const allowedOriginPatterns = [
  /^https:\/\/ed-tech-platform.*\.vercel\.app$/,
];

app.use(
  cors({
    origin(origin, callback) {
      const isAllowed =
        !origin ||
        cleanAllowedOrigins.includes(origin) ||
        allowedOriginPatterns.some((pattern) => pattern.test(origin));

      if (isAllowed) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl && req.originalUrl.startsWith("/api/payments/webhook")) {
        req.rawBody = buf;
      }
    },
  })
);

app.use("/api/auth", authLimiter, authRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/users", usersRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/payments", paymentsRouter);

app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("MongoDB connected ✅");

      const PORT = process.env.PORT || 5000;

      app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`🌐 API: http://localhost:${PORT}/api`);
      });
    })
    .catch((err) => {
      console.error("MongoDB connection error ❌", err);
    });
}

export default app;
