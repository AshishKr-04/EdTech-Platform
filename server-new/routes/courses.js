const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// ================= CREATE =================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      instructor: req.user.id,
    });

    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= INSTRUCTOR ROUTES (🔥 MUST BE BEFORE :id) =================

// 👉 My Courses
router.get("/instructor/my-courses", authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find({
      instructor: req.user.id,
    });

    res.json({ courses });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// 👉 Analytics
router.get("/instructor/analytics", authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find({
      instructor: req.user.id,
    });

    const courseIds = courses.map((c) => c._id);

    const users = await User.find({
      enrolledCourses: { $in: courseIds },
    });

    const totalStudents = users.length;

    const courseStats = courses.map((course) => {
      const students = users.filter((u) =>
        u.enrolledCourses.some(
          (id) => id.toString() === course._id.toString()
        )
      ).length;

      return {
        courseId: course._id,
        title: course.title,
        lessons: course.lessons.length,
        students,
      };
    });

    res.json({
      totalCourses: courses.length,
      totalStudents,
      courseStats,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET ALL =================
router.get("/", async (req, res) => {
  const courses = await Course.find().populate("instructor", "name");
  res.json({ courses });
});

// ================= GET ONE =================
router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate("instructor", "name email");

  if (!course) return res.status(404).json({ message: "Not found" });

  res.json({ course });
});

// ================= UPDATE =================
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json({ message: "Not found" });

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= ENROLL =================
router.post("/:id/enroll", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user.enrolledCourses.includes(req.params.id)) {
    user.enrolledCourses.push(req.params.id);
    await user.save();
  }

  res.json({ success: true });
});

// ================= PROGRESS =================
router.post("/:id/progress", authMiddleware, async (req, res) => {
  const { lessonIndex, time } = req.body;

  const user = await User.findById(req.user.id);

  let progress = user.progress.find(
    (p) => p.courseId.toString() === req.params.id
  );

  if (!progress) {
    user.progress.push({ courseId: req.params.id, lessonIndex, time });
  } else {
    progress.lessonIndex = lessonIndex;
    progress.time = time;
  }

  await user.save();

  res.json({ success: true });
});

router.get("/:id/progress", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id);

  const progress = user.progress.find(
    (p) => p.courseId.toString() === req.params.id
  );

  res.json({
    lessonIndex: progress?.lessonIndex || 0,
    time: progress?.time || 0,
  });
});

module.exports = router;