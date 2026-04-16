require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// ================= CORS =================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://edtech-platform-04.vercel.app",
    ],
    credentials: true,
  })
);

// ================= MIDDLEWARE =================
app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/users", require("./routes/users"));
app.use("/api/upload", require("./routes/upload"));

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ================= DB CONNECT =================
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