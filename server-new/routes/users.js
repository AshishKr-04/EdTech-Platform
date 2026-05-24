const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const AppError = require("../middleware/AppError");

// ================= GET MY LEARNING (STUDENT) =================
router.get("/my-learning", authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate("enrolledCourses");
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.json({
      courses: user.enrolledCourses || [],
    });
  } catch (err) {
    next(err);
  }
});

// ================= GET USER PROFILE (OPTIONAL) =================
router.get("/profile", authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("enrolledCourses")
      .populate("certificates.courseId", "title thumbnail description lessons")
      .select("-password");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
});

// ================= UPDATE USER PROFILE =================
router.put("/profile", authMiddleware, async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    await user.save();
    
    // Return sanitized profile details
    const updatedUser = await User.findById(req.user.id)
      .populate("enrolledCourses")
      .populate("certificates.courseId", "title thumbnail description lessons")
      .select("-password");

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    next(err);
  }
});

module.exports = router;