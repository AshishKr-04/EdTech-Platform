import express from "express";
import crypto from "crypto";
const router = express.Router();

import Course from "../models/Course.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";
import restrictTo from "../middleware/restrictTo.js";
import AppError from "../middleware/AppError.js";
import { validate, validateIdParam } from "../middleware/validate.js";
import {
  courseSchema,
  courseUpdateSchema,
  progressSchema,
} from "../utils/validationSchemas.js";

// ================= CREATE =================
router.post(
  "/",
  authMiddleware,
  restrictTo("Instructor"),
  validate(courseSchema),
  async (req, res, next) => {
    try {
      const course = new Course({
        ...req.body,
        instructor: req.user.id,
      });

      await course.save();
      res.status(201).json(course);
    } catch (err) {
      next(err);
    }
  }
);

// ================= INSTRUCTOR ROUTES (🔥 MUST BE BEFORE :id) =================

// 👉 My Courses
router.get(
  "/instructor/my-courses",
  authMiddleware,
  restrictTo("Instructor"),
  async (req, res, next) => {
    try {
      const courses = await Course.find({
        instructor: req.user.id,
      });

      res.json({ courses });
    } catch (err) {
      next(err);
    }
  }
);

// 👉 Analytics
router.get(
  "/instructor/analytics",
  authMiddleware,
  restrictTo("Instructor"),
  async (req, res, next) => {
    try {
      const courses = await Course.find({
        instructor: req.user.id,
      });

      const courseIds = courses.map((c) => c._id);

      const users = await User.find({
        enrolledCourses: { $in: courseIds },
      });

      const totalStudents = users.length;

      const courseStats = courses.map((course) => {
        const students = users.filter((u) =>
          u.enrolledCourses.some(
            (id) => id.toString() === course._id.toString()
          )
        ).length;

        return {
          courseId: course._id,
          title: course.title,
          lessons: course.lessons.length,
          students,
        };
      });

      res.json({
        totalCourses: courses.length,
        totalStudents,
        courseStats,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ================= GET ALL =================
router.get("/", async (req, res, next) => {
  try {
    const courses = await Course.find().populate("instructor", "name");
    res.json({ courses });
  } catch (err) {
    next(err);
  }
});

// ================= GET ONE (PUBLIC PREVIEW) =================
router.get("/:id", validateIdParam("id"), async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email");

    if (!course) {
      return next(new AppError("Course not found", 404));
    }

    // Convert Mongoose document to a plain JavaScript object
    const courseObj = course.toObject();

    // Anti-Piracy Lock: Strip out videoUrl and content from public view
    if (courseObj.lessons) {
      courseObj.lessons = courseObj.lessons.map((lesson) => {
        const { videoUrl, content, ...publicLesson } = lesson;
        return publicLesson;
      });
    }

    res.json({ course: courseObj });
  } catch (err) {
    next(err);
  }
});

// ================= GET ONE SECURE (ENROLLED ONLY) =================
router.get(
  "/:id/learn",
  authMiddleware,
  validateIdParam("id"),
  async (req, res, next) => {
    try {
      const course = await Course.findById(req.params.id)
        .populate("instructor", "name email");

      if (!course) {
        return next(new AppError("Course not found", 404));
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      const isEnrolled = user.enrolledCourses.includes(req.params.id);
      const isInstructor = course.instructor._id.toString() === req.user.id;

      if (!isEnrolled && !isInstructor) {
        return next(
          new AppError(
            "You must purchase or enroll in this course to access private lecture videos and notes.",
            403
          )
        );
      }

      res.json({ course });
    } catch (err) {
      next(err);
    }
  }
);

// ================= UPDATE =================
router.put(
  "/:id",
  authMiddleware,
  restrictTo("Instructor"),
  validateIdParam("id"),
  validate(courseUpdateSchema),
  async (req, res, next) => {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return next(new AppError("Course not found", 404));
      }

      if (course.instructor.toString() !== req.user.id) {
        return next(new AppError("You are not authorized to edit this course", 403));
      }

      const updated = await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

// ================= ENROLL =================
router.post(
  "/:id/enroll",
  authMiddleware,
  validateIdParam("id"),
  async (req, res, next) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return next(new AppError("Course not found", 404));
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      if (!user.enrolledCourses.includes(req.params.id)) {
        user.enrolledCourses.push(req.params.id);
        await user.save();

        // Increment studentsCount upon student's manual enrollment
        course.studentsCount = (course.studentsCount || 0) + 1;
        await course.save();
      }

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

// ================= PROGRESS =================
router.post(
  "/:id/progress",
  authMiddleware,
  validateIdParam("id"),
  validate(progressSchema),
  async (req, res, next) => {
    try {
      const { lessonIndex, time } = req.body;

      const course = await Course.findById(req.params.id);
      if (!course) {
        return next(new AppError("Course not found", 404));
      }

      if (lessonIndex >= course.lessons.length) {
        return next(new AppError("Lesson index out of range for this course", 400));
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      // Check if user is enrolled
      const isEnrolled = user.enrolledCourses.includes(req.params.id);
      const isInstructor = course.instructor.toString() === req.user.id;
      if (!isEnrolled && !isInstructor) {
        return next(new AppError("You must be enrolled in this course to save progress.", 403));
      }

      let progress = user.progress.find(
        (p) => p.courseId.toString() === req.params.id
      );

      if (!progress) {
        user.progress.push({ courseId: req.params.id, lessonIndex, time });
      } else {
        progress.lessonIndex = lessonIndex;
        progress.time = time;
      }

      await user.save();
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  "/:id/progress",
  authMiddleware,
  validateIdParam("id"),
  async (req, res, next) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) {
        return next(new AppError("Course not found", 404));
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      // Check if user is enrolled
      const isEnrolled = user.enrolledCourses.includes(req.params.id);
      const isInstructor = course.instructor.toString() === req.user.id;
      if (!isEnrolled && !isInstructor) {
        return next(new AppError("You must be enrolled in this course to access progress.", 403));
      }

      const progress = user.progress.find(
        (p) => p.courseId.toString() === req.params.id
      );

      res.json({
        lessonIndex: progress?.lessonIndex || 0,
        time: progress?.time || 0,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ================= AI TUTOR =================
router.post(
  "/:id/lessons/:lessonIndex/ai-tutor",
  authMiddleware,
  validateIdParam("id"),
  async (req, res, next) => {
    try {
      const { message } = req.body;
      const { id, lessonIndex } = req.params;
      const idx = parseInt(lessonIndex, 10);

      if (!message || message.trim() === "") {
        return next(new AppError("Message is required", 400));
      }

      const course = await Course.findById(id);
      if (!course) {
        return next(new AppError("Course not found", 404));
      }

      if (idx < 0 || idx >= course.lessons.length) {
        return next(new AppError("Lesson index out of range", 400));
      }

      // Check if user is enrolled (Security check)
      const user = await User.findById(req.user.id);
      if (!user.enrolledCourses.includes(id) && course.instructor.toString() !== req.user.id) {
        return next(new AppError("You must be enrolled in this course to consult the AI Tutor", 403));
      }

      const activeLesson = course.lessons[idx];
      const lessonTitle = activeLesson.title;
      const lessonContent = activeLesson.content || "This lesson has video streaming. Ask me questions about the topic!";

      const systemPrompt = `You are "EduMind AI", a friendly, highly intelligent, and helpful study tutor built directly into the Edu Mind EdTech platform.
You are helping the student with the course "${course.title}".
Currently, the student is studying the lesson: "${lessonTitle}".
Lesson content or notes:
"${lessonContent}"

Instructions:
1. Guide the student step-by-step. Break down complex programming or general concepts into easy-to-understand terms.
2. Maintain context. Answer the student's question based strictly on this lesson or relevant details of the course.
3. Keep your response in beautifully formatted Markdown. Use bold headers, clean lists, and code blocks for programming sections where helpful.
4. Keep your tone encouraging and educational.`;

      // Check if Gemini API key exists
      if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === "YOUR_GEMINI_API_KEY") {
        console.log("Gemini API Key missing. Running in Smart Mock Fallback Mode.");
        
        let mockResponse = `### Hello! I am your **EduMind AI Study Tutor** 🤖.

*Note: The Gemini API Key is not set up on the server yet. I am currently running in a highly context-aware **Smart Mock Mode** to show you how I work!*

Regarding your query about the lesson **"${lessonTitle}"** in the course **"${course.title}"**:

You asked: *"${message}"*

Here is an explanation designed to help you succeed:
1. **Focus of this Lesson:** We are covering **"${lessonTitle}"**. The key concept is how to apply these techniques to build robust applications.
2. **Key Takeaway:** Always break down the solution into smaller, manageable parts. If this is a coding course, make sure to structure your imports and schemas cleanly.
3. **Practice Tip:** Try writing a small script to test this concept on your own!

Let me know if you would like me to summarize the notes, explain a concept simply, or test you with a quick quiz question!`;

        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes("summarize") || lowerMsg.includes("summary")) {
          mockResponse = `### 📝 Lesson Summary: **"${lessonTitle}"**

Here is a concise breakdown of the concepts covered in this lesson:
*   **Key Concept:** Understanding the core mechanics of "${lessonTitle}".
*   **Application:** Practical steps to implement this concept in real projects.
*   **Why it matters:** Master this to build highly optimized, secure applications.

**Action Item:** Review the video player controls or make notes on the key syntax. Let me know if you want me to quiz you!`;
        } else if (lowerMsg.includes("explain") || lowerMsg.includes("concept")) {
          mockResponse = `### 💡 Concept Breakdown: **"${lessonTitle}"**

Let's simplify what we are learning in this module:
1.  **The Core Idea:** Imagine this concept like a security guard. Just as a guard validates credentials at a gate, we validate inputs in our backend to protect our databases!
2.  **Why we use it:** To prevent invalid data or cast crashes.
3.  **Real-world analogy:** Shopping checkouts requiring a valid credit card before completing a purchase.

Does this explanation help? Let me know if you'd like another analogy!`;
        } else if (lowerMsg.includes("quiz") || lowerMsg.includes("test")) {
          mockResponse = `### 🏆 Quick Quiz: **"${lessonTitle}"**

Let's test your understanding! Here is a multiple-choice question:

**Question:** Which of the following is the primary goal of studying "${lessonTitle}"?
*   [A] Completing the course as fast as possible.
*   [B] Protecting application states, ensuring data integrity, and learning best practices.
*   [C] Bypassing security checks.
*   [D] Running infinite loops.

*Reply with **A, B, C, or D** and I will tell you if you got it right!*`;
        }

        await new Promise((resolve) => setTimeout(resolve, 600));

        return res.json({ response: mockResponse });
      }

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const promptText = `${systemPrompt}\n\nStudent's Question: "${message}"\n\nAI Tutor Response:`;

      const response = await fetch(geminiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: promptText,
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        console.error("Gemini API error details:", errData);
        throw new AppError("Failed to communicate with the AI Tutor service.", 502);
      }

      const data = await response.json();
      const aiResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm sorry, I encountered an issue processing that request. Please try again.";

      res.json({ response: aiResponse });
    } catch (err) {
      next(err);
    }
  }
);

// ================= LESSON COMPLETION =================
router.post(
  "/:id/lessons/:lessonId/complete",
  authMiddleware,
  validateIdParam("id"),
  validateIdParam("lessonId"),
  async (req, res, next) => {
    try {
      const { id, lessonId } = req.params;

      const course = await Course.findById(id);
      if (!course) {
        return next(new AppError("Course not found", 404));
      }

      // Check if user is enrolled in the course
      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      const isEnrolled = user.enrolledCourses.includes(id);
      if (!isEnrolled) {
        return next(new AppError("You must be enrolled in this course to complete lessons.", 403));
      }

      // Check if the lesson belongs to the course
      const lesson = course.lessons.id(lessonId);
      if (!lesson) {
        return next(new AppError("Lesson not found in this course", 404));
      }

      // Push lesson ID to user's completedLessons if not already present
      const isAlreadyCompleted = user.completedLessons.some(
        (lId) => lId.toString() === lessonId
      );

      if (!isAlreadyCompleted) {
        user.completedLessons.push(lessonId);
        await user.save();
      }

      // Calculate if the student has completed 100% of this course's lessons
      const courseLessonIds = course.lessons.map((l) => l._id.toString());
      const completedCourseLessons = user.completedLessons.filter((lId) =>
        courseLessonIds.includes(lId.toString())
      );

      const completedLessonsCount = completedCourseLessons.length;
      const totalLessonsCount = course.lessons.length;

      let certificateIssued = false;
      let certificate = null;

      // If completed 100% of lessons and no certificate exists yet for this course
      if (totalLessonsCount > 0 && completedLessonsCount === totalLessonsCount) {
        const hasCertificate = user.certificates.some(
          (c) => c.courseId.toString() === id
        );

        if (!hasCertificate) {
          const certificateId = crypto.randomUUID();
          const salt = process.env.CERTIFICATE_SALT || "super_secret_certificate_salt_key";
          const hash = crypto
            .createHmac("sha256", salt)
            .update(`${req.user.id}:${id}:${certificateId}`)
            .digest("hex");

          certificate = {
            courseId: id,
            certificateId,
            hash,
            issuedAt: new Date(),
          };

          user.certificates.push(certificate);
          await user.save();
          certificateIssued = true;
        } else {
          // Retrieve existing certificate if already generated
          certificate = user.certificates.find((c) => c.courseId.toString() === id);
        }
      }

      res.json({
        success: true,
        completedLessonsCount,
        totalLessons: totalLessonsCount,
        certificateIssued,
        certificate,
      });
    } catch (err) {
      next(err);
    }
  }
);

// ================= GET CERTIFICATE =================
router.get(
  "/:id/certificate",
  authMiddleware,
  validateIdParam("id"),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      const isEnrolled = user.enrolledCourses.includes(id);
      if (!isEnrolled) {
        return next(new AppError("You are not enrolled in this course.", 403));
      }

      const certificate = user.certificates.find(
        (c) => c.courseId.toString() === id
      );

      if (!certificate) {
        return next(new AppError("Certificate not found for this course.", 404));
      }

      res.json({
        success: true,
        certificate,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;