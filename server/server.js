// server/server.js

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses'); // 👈 Added this line

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Use Routes ---
// Any request to /api/auth will be handled by authRoutes
app.use('/api/auth', authRoutes);
// Any request to /api/courses will be handled by courseRoutes
app.use('/api/courses', courseRoutes); // 👈 And this line

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