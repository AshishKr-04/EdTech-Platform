const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const AppError = require("../middleware/AppError");
const { validate } = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../utils/validationSchemas");

const router = express.Router();

// REGISTER
router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return next(new AppError("User already exists with this email", 400));
    }

    const hashed = await bcrypt.hash(password, 10);

    user = new User({
      name,
      email,
      password: hashed,
      role: role || "Student",
    });

    await user.save();

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Explicitly convert to object and ensure password is removed from register response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ token, user: userResponse });
  } catch (err) {
    next(err);
  }
});

// LOGIN
router.post("/login", validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password field since it is select: false by default
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new AppError("Invalid credentials", 400));
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return next(new AppError("Invalid credentials", 400));
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Explicitly delete password from login response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ token, user: userResponse });
  } catch (err) {
    next(err);
  }
});

// CURRENT USER
router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    // Queries User WITHOUT password (since select: false is set on password schema)
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;