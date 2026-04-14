const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middleware/auth");


// ================= GET MY LEARNING (STUDENT) =================
router.get("/my-learning", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("enrolledCourses"); // 🔥 VERY IMPORTANT

    res.json({
      courses: user.enrolledCourses || [],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// ================= GET USER PROFILE (OPTIONAL) =================
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;