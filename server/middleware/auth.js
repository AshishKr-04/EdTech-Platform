const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get the full authorization header
  const authHeader = req.header('Authorization');

  // Check for header
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // The header format is "Bearer <token>", so we split the string and get the token part
  const token = authHeader.split(' ')[1];

  // Check if token exists after split
  if (!token) {
    return res.status(401).json({ msg: 'Token format is invalid, authorization denied' });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};