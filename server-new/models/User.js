const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    enum: ['Student', 'Instructor'],
    default: 'Student',
  },

  // ✅ Enrolled Courses
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
  ],

  // ✅ NEW: Progress Tracking
  progress: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
      completedLessons: [
        {
          type: Number, // lesson index
        },
      ],
    },
  ],

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);