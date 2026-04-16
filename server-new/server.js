// :contentReference[oaicite:8]{index=8}
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// ✅ FIXED CORS
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://edtech-platform-04.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());

// ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/courses"));
app.use("/api/users", require("./routes/users"));
app.use("/api/upload", require("./routes/upload"));

app.get("/", (req, res) => res.send("Server running 🚀"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(process.env.PORT || 5000, () =>
      console.log("Server running 🚀")
    );
  })
  .catch(err => console.error(err));