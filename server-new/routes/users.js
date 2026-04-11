const express = require('express');
const router = express.Router();

const User = require('../models/User');
const authMiddleware = require('../middleware/auth');


// ================= GET MY COURSES =================
router.get('/enrolled-courses', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('enrolledCourses');

    res.json({
      courses: user.enrolledCourses
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;