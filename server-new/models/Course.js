const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  // --- 👇 ADD THIS FIELD FOR VIDEO INTEGRATION ---
  videoUrl: { 
    type: String, 
    required: false, // Set to false so you can still have text-only lessons
    default: '' 
  },
});

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lessons: [LessonSchema],

  price: { type: Number, required: true, default: 0 },
  duration: { type: String, required: true, default: '0 total hours' },
  rating: { type: Number, default: 4.5 },
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);