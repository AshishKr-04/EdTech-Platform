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

// ================= 1. CORS FIRST (Prevents Preflight/OPTIONS & 429 Silent CORS Failures) =================
const hardcodedOrigins = [
  "https://ed-tech-platform-phi.vercel.app",
  "https://ed-tech-platform-teacherapp.vercel.app",
  "https://ed-tech-platform-adminapp.vercel.app",
];

const allowedOrigins = [...hardcodedOrigins];

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
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:3000",
    "http://localhost:5000"
  );
}

const cleanAllowedOrigins = allowedOrigins
  .map((origin) => origin && origin.trim())
  .filter(Boolean);

// Match any preview/branch Vercel deployments dynamically
const allowedOriginPatterns = [
  /^https:\/\/ed-tech-platform.*\.vercel\.app$/,
];

const corsOptions = {
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
};

app.use(cors(corsOptions));

// ================= 2. SECURITY HEADERS =================
app.use(helmet());

// ================= 3. RATE LIMITERS (Skip OPTIONS Preflight) =================
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  skip: (req) => req.method === "OPTIONS",
  message: {
    status: "fail",
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  skip: (req) => req.method === "OPTIONS",
  message: {
    status: "fail",
    message: "Too many authentication attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

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
    .connect(process.env.MONGO_URI || process.env.MONGODB_URL)
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
