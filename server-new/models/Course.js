// :contentReference[oaicite:2]{index=2}
const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title: String,
  content: String,
  videoUrl: String,
});

const CourseSchema = new mongoose.Schema(
  {
    title: String,
    description: String,

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    lessons: [LessonSchema],

    price: Number,
    duration: String,

    thumbnail: { type: String, default: "" }, // 🔥 NEW
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);