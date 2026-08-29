import express from "express";
const router = express.Router();

import User from "../models/User.js";
import Course from "../models/Course.js";
import authMiddleware from "../middleware/auth.js";
import restrictTo from "../middleware/restrictTo.js";
import AppError from "../middleware/AppError.js";

// ================= PUBLIC: PLATFORM GLOBAL ANALYTICS STATS =================
router.get("/public-stats", async (req, res, next) => {
  try {
    const totalCourses = await Course.countDocuments({ 
      $or: [{ status: "Published" }, { status: { $exists: false } }] 
    });
    const totalStudents = await User.countDocuments({ role: "Student" });
    const totalTeachers = await User.countDocuments({ 
      role: { $in: ["Teacher", "Instructor"] } 
    });

    const mostFollowed = await Course
      .findOne({ $or: [{ status: "Published" }, { status: { $exists: false } }] })
      .sort({ studentsCount: -1 })
      .select("title studentsCount thumbnail");

    res.json({
      success: true,
      totalCourses,
      totalStudents,
      totalTeachers,
      mostFollowedCourse: mostFollowed ? {
        title: mostFollowed.title,
        studentsCount: mostFollowed.studentsCount,
        thumbnail: mostFollowed.thumbnail || "",
      } : null
    });
  } catch (err) {
    next(err);
  }
});

// ================= PUBLIC: VERIFY CERTIFICATE =================
router.get("/verify-certificate/:certId", async (req, res, next) => {
  try {
    const user = await User.findOne({ "certificates.certificateId": req.params.certId })
      .populate("certificates.courseId", "title duration category thumbnail");

    if (!user) {
      return next(new AppError("Invalid certificate ID or credential not found", 404));
    }

    const certificate = user.certificates.find(c => c.certificateId === req.params.certId);

    res.json({
      success: true,
      studentName: user.name,
      courseTitle: certificate.courseId?.title || "Unknown Course",
      courseDuration: certificate.courseId?.duration || "Self-Paced",
      courseCategory: certificate.courseId?.category || "General",
      courseThumbnail: certificate.courseId?.thumbnail || "",
      issuedAt: certificate.issuedAt,
      hash: certificate.hash,
    });
  } catch (err) {
    next(err);
  }
});

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

// ================= ADMIN: GET ALL USERS =================
router.get(
  "/",
  authMiddleware,
  restrictTo("Admin"),
  async (req, res, next) => {
    try {
      const users = await User.find().select("-password").sort({ createdAt: -1 });
      res.json({ success: true, users });
    } catch (err) {
      next(err);
    }
  }
);

// ================= ADMIN: UPDATE USER ROLE =================
router.put(
  "/:id/role",
  authMiddleware,
  restrictTo("Admin"),
  async (req, res, next) => {
    try {
      const { role } = req.body;
      if (!["Student", "Teacher", "Admin"].includes(role)) {
        return next(new AppError("Invalid role", 400));
      }

      const user = await User.findById(req.params.id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      user.role = role;
      await user.save();

      res.json({ success: true, user });
    } catch (err) {
      next(err);
    }
  }
);

// ================= ADMIN: DELETE USER =================
router.delete(
  "/:id",
  authMiddleware,
  restrictTo("Admin"),
  async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      await User.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: "User deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;