const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');

// Create a course
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'Instructor') {
      return res.status(403).json({ msg: 'Access denied. Instructors only.' });
    }
    const { title, description, price, duration, lessons } = req.body;
    const newCourse = new Course({
      title,
      description,
      price,
      duration,
      lessons,
      instructor: req.user.id,
    });
    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', ['name']);
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all courses for the logged-in instructor
router.get('/my-courses', authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id }).populate('instructor', ['name']);
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get a single course by its ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', ['name']);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a course
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, price, duration, lessons } = req.body;
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    if (course.instructor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, price, duration, lessons } },
      { new: true }
    );
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- 👇 THIS IS THE NEW ROUTE TO ADD ---
// @route   POST api/courses/:id/enroll
// @desc    Enroll the logged-in student in a course
// @access  Private (Student only)
router.post('/:id/enroll', authMiddleware, async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;

    // Find the user and add the course to their enrolledCourses array
    // We use $addToSet to prevent duplicate enrollments
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true } // Return the updated user document
    );

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user.enrolledCourses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// --- 👆 END OF NEW ROUTE ---

module.exports = router;