const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  lessonIndex: Number,
  time: Number,
});

const CertificateSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  certificateId: {
    type: String,
    required: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
  hash: {
    type: String,
    required: true,
  },
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      select: false,
    },

    role: {
      type: String,
      enum: ["Student", "Instructor"],
      default: "Student",
    },

    // Mongoose Alias: purchasedCourses will map directly to the underlying enrolledCourses array!
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        alias: "purchasedCourses",
      },
    ],

    progress: [ProgressSchema],

    // 🔥 NEW RICH USER FIELDS
    avatar: {
      type: String,
      default: "",
    },
    completedLessons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course.lessons",
      },
    ],
    certificates: [CertificateSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);