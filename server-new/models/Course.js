import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  videoUrl: String,
  duration: { type: String, default: "15 mins" }, // 🔥 Added lesson duration
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

    price: { type: Number, required: true, default: 0 },
    duration: { type: String, required: true }, // Total course duration (e.g. '10 weeks')
    thumbnail: { type: String, default: "" },

    // 🔥 NEW RICH DATA MODEL FIELDS
    category: {
      type: String,
      default: "General",
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    status: {
      type: String,
      enum: ["Draft", "Published"],
      default: "Published",
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    studentsCount: {
      type: Number,
      default: 0,
    },
    learningOutcomes: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", CourseSchema);