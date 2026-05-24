require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// ================= SECURITY HEADERS =================
app.use(helmet());

// ================= RATE LIMITING =================
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  message: {
    status: "fail",
    message: "Too many requests from this IP. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 login/registration requests per 15 minutes
  message: {
    status: "fail",
    message: "Too many authentication attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

// ================= CORS =================
const allowedOrigins = [];

if (process.env.NODE_ENV === "production") {
  // STRICT env-driven origins in production
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
  // Local development allowed origins
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

// ================= MIDDLEWARE =================
app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.originalUrl && req.originalUrl.startsWith("/api/payments/webhook")) {
        req.rawBody = buf;
      }
    },
  })
);

// ================= ROUTES =================
app.use("/api/auth", authLimiter, require("./routes/auth")); // 🔥 Auth rate limiter applied
app.use("/api/courses", require("./routes/courses"));
app.use("/api/users", require("./routes/users"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/payments", require("./routes/payments"));

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ================= ERROR HANDLING =================
app.use(require("./middleware/errorHandler"));

// ================= DB CONNECT & LISTEN =================
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

module.exports = app; // 🔥 Export Express app for integration testing
