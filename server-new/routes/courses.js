const express = require('express');
const router = express.Router();

const Course = require('../models/Course');
const User = require('../models/User');

const authMiddleware = require('../middleware/auth');
const instructorMiddleware = require('../middleware/instructor');


// =====================================================
// ✅ 1. INSTRUCTOR ROUTES (TOP PRIORITY)
// =====================================================

// GET MY COURSES (Instructor Dashboard)
router.get(
  '/instructor/my-courses',
  authMiddleware,
  instructorMiddleware,
  async (req, res) => {
    try {
      const courses = await Course.find({
        instructor: req.user.id,
      }).sort({ createdAt: -1 });

      res.json({
        success: true,
        courses,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);


// =====================================================
// ✅ 2. CREATE COURSE (Instructor only)
// =====================================================

router.post('/', authMiddleware, instructorMiddleware, async (req, res) => {
  try {
    const { title, description, lessons, price, duration } = req.body;

    const course = new Course({
      title,
      description,
      lessons: lessons || [],
      price: price || 0,
      duration: duration || "0 hours",
      instructor: req.user.id,
    });

    await course.save();

    res.status(201).json({
      success: true,
      course,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// =====================================================
// ✅ 3. GET ALL COURSES
// =====================================================

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name');

    res.json({
      success: true,
      courses,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// =====================================================
// ✅ 4. PROGRESS + ENROLL ROUTES (BEFORE :id)
// =====================================================

// ENROLL
router.post('/:id/enroll', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const courseId = req.params.id;

    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    user.enrolledCourses.push(courseId);
    await user.save();

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// MARK PROGRESS
router.post('/:id/progress', authMiddleware, async (req, res) => {
  try {
    const { lessonIndex } = req.body;
    const user = await User.findById(req.user.id);

    let progress = user.progress.find(
      p => p.courseId.toString() === req.params.id
    );

    if (!progress) {
      progress = {
        courseId: req.params.id,
        completedLessons: []
      };
      user.progress.push(progress);
    }

    if (!progress.completedLessons.includes(lessonIndex)) {
      progress.completedLessons.push(lessonIndex);
    }

    await user.save();

    res.json({ success: true, progress });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// GET PROGRESS
router.get('/:id/progress', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const progress = user.progress.find(
      p => p.courseId.toString() === req.params.id
    );

    res.json({
      completedLessons: progress?.completedLessons || []
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// =====================================================
// ✅ 5. UPDATE COURSE (Instructor only)
// =====================================================

router.put('/:id', authMiddleware, instructorMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      course: updated,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// =====================================================
// ✅ 6. DELETE COURSE (Instructor only)
// =====================================================

router.delete('/:id', authMiddleware, instructorMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await course.deleteOne();

    res.json({
      success: true,
      message: "Course deleted",
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// =====================================================
// ✅ 7. GET SINGLE COURSE (MUST BE LAST)
// =====================================================

router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name');

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({
      success: true,
      course,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;