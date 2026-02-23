require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// --- Import Routes ---
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/users');

const app = express();

// Render often uses port 10000, while local development uses 5000
const PORT = process.env.PORT || 10000;

// --- Middlewares ---

// 1. Updated CORS Configuration
// This allows your Vercel frontend and Local frontend to communicate with this Render backend
app.use(cors({
  origin: [
    'http://localhost:5173',                   // Local Vite Development
    'https://edtech-platform-04.vercel.app'    // Your Live Vercel Frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// 2. Root Health Check Route
// Useful to check if the Render instance is "awake"
app.get('/', (req, res) => {
  res.send('EduMind Backend is running successfully! 🚀');
});

// --- Use Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);

// --- Database Connection & Server Start ---
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