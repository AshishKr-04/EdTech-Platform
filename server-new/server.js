require('dotenv').config();

// 👇 Add this single line for debugging
console.log('The value of MONGO_URI is:', process.env.MONGO_URI);

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// --- Import Routes ---
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Use Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

// --- Database Connection & Server Start ---
console.log('Attempting to connect to MongoDB...');
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