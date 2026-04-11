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

// ✅ CORS CONFIG (FINAL FIX)
const allowedOrigins = [
  'http://localhost:5173', // local
  'https://edtech-platform-04.vercel.app', // old vercel
  'https://ed-tech-platform-ey8a469gi-ashish-kumars-projects-1d996dea.vercel.app' // current vercel
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, Thunder Client)
    if (!origin) return callback(null, true);

    // Allow all Vercel preview deployments (VERY IMPORTANT)
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }

    // Allow whitelisted origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("❌ Blocked by CORS:", origin);
    return callback(new Error("CORS not allowed"));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());

// ✅ Health check route
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