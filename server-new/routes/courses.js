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
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= GET ALL =================
router.get("/", async (req, res) => {
  const courses = await Course.find().populate("instructor", "name");
  res.json({ courses });
});


// 🔥 ADD YOUR ROUTE HERE
router.get("/instructor/my-courses", authMiddleware, async (req, res) => {
  const courses = await Course.find({
    instructor: req.user.id,
  });

  res.json({ courses });
});


// ================= GET ONE =================
router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate("instructor", "name email");

  if (!course) return res.status(404).json({ message: "Not found" });

  res.json({ course });
});

module.exports = router;