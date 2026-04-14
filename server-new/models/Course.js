const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  videoUrl: { type: String, default: "" },
});

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lessons: [LessonSchema],

    price: { type: Number, default: 0 },
    duration: { type: String, default: "0 hours" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);