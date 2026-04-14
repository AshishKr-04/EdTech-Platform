const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middleware/auth"); // ✅ FIXED

router.get("/enrolled-courses", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).populate("enrolledCourses");

  res.json({
    success: true,
    courses: user.enrolledCourses,
  });
});

module.exports = router;