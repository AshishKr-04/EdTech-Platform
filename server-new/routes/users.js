const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/users/my-learning
// @desc    Get all enrolled courses for the logged-in student
// @access  Private
router.get('/my-learning', authMiddleware, async (req, res) => {
  try {
    // Find the user and populate the enrolledCourses field
    // This will replace the course IDs with the full course documents
    const user = await User.findById(req.user.id).populate({
        path: 'enrolledCourses',
        populate: {
            path: 'instructor',
            select: 'name' // Also populate the instructor's name within each course
        }
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user.enrolledCourses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;