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
    type: mongoose.Schema.Types.ObjectId, // A link to the User who created it
    ref: 'User', // The 'User' model
    required: true,
  },
  lessons: [LessonSchema], // An array of lessons
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);