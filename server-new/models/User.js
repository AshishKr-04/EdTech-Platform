const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  lessonIndex: Number,
  time: Number,
});

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,

    role: {
      type: String,
      enum: ["Student", "Instructor"],
      default: "Student",
    },

    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    progress: [ProgressSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);