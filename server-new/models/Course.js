const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
});

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  lessons: [LessonSchema],

  // --- 👇 NEW FIELDS ADDED HERE ---
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  duration: {
    type: String, // e.g., "8.5 total hours"
    required: true,
    default: '0 total hours',
  },
  rating: {
    type: Number,
    default: 4.5, // Default rating
  },

}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);