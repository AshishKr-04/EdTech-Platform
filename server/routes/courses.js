const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Our new auth middleware
const Course = require('../models/Course');
const User = require('../models/User'); // ✅ This line is now correct

// @route   POST api/courses
// @desc    Create a course
// @access  Private (Instructor only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    // Check if the user is an instructor
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'Instructor') {
      return res.status(403).json({ msg: 'Access denied. Instructors only.' });
    }

    const { title, description, lessons } = req.body;
  
    const newCourse = new Course({
      title,
      description,
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

// @route   GET api/courses
// @desc    Get all courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', ['name']);
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;