const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();


// ================= REGISTER =================
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // ✅ Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'All fields are required',
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    // ✅ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'Student', // default
    });

    await user.save();

    // ✅ CLEAN JWT PAYLOAD (IMPORTANT)
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: 'User registered successfully',
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: 'Server error',
    });
  }
});


// ================= LOGIN =================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // ✅ Validation
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }

    // ✅ CLEAN JWT PAYLOAD
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: 'Server error',
    });
  }
});


// ================= GET CURRENT USER =================
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password');

    res.json({
      success: true,
      user,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      message: 'Server error',
    });
  }
});


module.exports = router;