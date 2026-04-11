const mongoose = require('mongoose');

// Lesson Schema
const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  // ✅ Video support
  videoUrl: {
    type: String,
    default: '',
  },
});

// Course Schema
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

  price: {
    type: Number,
    default: 0,
  },

  duration: {
    type: String,
    default: '0 total hours',
  },

  rating: {
    type: Number,
    default: 4.5,
  },

}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);