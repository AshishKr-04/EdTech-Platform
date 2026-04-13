require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// ✅ CREATE APP FIRST
const app = express();

// Routes
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");
const userRoutes = require("./routes/users");
const uploadRoutes = require("./routes/upload");

// PORT
const PORT = process.env.PORT || 5000;

// ✅ MIDDLEWARE
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://edtech-platform-04.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// ✅ ROUTES (AFTER app is defined)
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ✅ DB CONNECT
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  })
  .catch((err) => {
    console.error("MongoDB error ❌", err);
  });