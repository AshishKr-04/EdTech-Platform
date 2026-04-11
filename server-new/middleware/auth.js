const jwt = require('jsonwebtoken');

// AUTH
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, role }
    next();

  } catch (err) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// INSTRUCTOR
const instructorOnly = (req, res, next) => {
  if (req.user.role !== "Instructor") {
    return res.status(403).json({ message: "Instructor only" });
  }
  next();
};

module.exports = { authMiddleware, instructorOnly };