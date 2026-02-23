require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// --- Import Routes ---
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 10000; 

// --- Middlewares ---
// This allows your local Vite server (5173) to talk to the Render server
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// Root Health Check Route
app.get('/', (req, res) => {
  res.send('EduMind Backend is running successfully! 🚀');
});

// --- Use Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);

// --- Database Connection ---
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