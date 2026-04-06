require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ CORS CONFIG (IMPORTANT)
const allowedOrigins = [
  'http://localhost:5173',
  'https://edtech-platform-04.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman / Thunder Client
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());

// Health route
app.get('/', (req, res) => {
  res.send('EduMind Backend is running successfully! 🚀');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);

// MongoDB connection
console.log('Attempting to connect to MongoDB Atlas...');

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully! ✅');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('🔴 MongoDB connection error:', err);
  });