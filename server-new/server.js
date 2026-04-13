require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// ✅ CREATE APP FIRST
const app = express();

// ================= ROUTES =================
const authRoutes = require("./routes/auth");
const courseRoutes = require("./routes/courses");
const userRoutes = require("./routes/users");
const uploadRoutes = require("./routes/upload");

// ================= PORT =================
const PORT = process.env.PORT || 5000;

// ================= CORS FIX =================
// 🔥 Allow all origins (fixes your issue immediately)
app.use(cors({
  origin: "*",
}));

// ================= MIDDLEWARE =================
app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// ================= DB CONNECT =================
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