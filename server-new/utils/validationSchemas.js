import { z } from "zod";

// MongoDB 24-character hex ID validation
const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format. Must be a 24-character hex string.");

// Auth schemas
const registerSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters"),
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email("Please provide a valid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, "Password must be at least 6 characters long"),
    role: z
      .enum(["Student", "Instructor"], {
        errorMap: () => ({ message: "Role must be either Student or Instructor" }),
      })
      .optional(),
    avatar: z.string().trim().url("Please provide a valid avatar URL").optional().or(z.literal("")),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .trim()
      .email("Please provide a valid email address"),
    password: z
      .string({ required_error: "Password is required" })
      .min(1, "Password is required"),
  }),
});

// Course schemas
const lessonSchema = z.object({
  title: z
    .string({ required_error: "Lesson title is required" })
    .trim()
    .min(2, "Lesson title must be at least 2 characters"),
  content: z.string().trim().optional(),
  videoUrl: z.string().trim().optional(),
  duration: z.string().trim().optional().default("15 mins"),
});

const courseSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Course title is required" })
      .trim()
      .min(3, "Course title must be at least 3 characters")
      .max(100, "Course title cannot exceed 100 characters"),
    description: z
      .string({ required_error: "Description is required" })
      .trim()
      .min(10, "Description must be at least 10 characters long"),
    price: z
      .number({ required_error: "Price is required" })
      .nonnegative("Price must be a non-negative number"),
    duration: z
      .string({ required_error: "Duration is required" })
      .trim()
      .min(1, "Duration is required"),
    lessons: z
      .array(lessonSchema)
      .min(1, "Course must have at least 1 lesson")
      .optional()
      .default([]),
    thumbnail: z.string().trim().optional(),
    
    // Optional catalog filter fields
    category: z.string().trim().optional().default("General"),
    level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional().default("Beginner"),
    status: z.enum(["Draft", "Published"]).optional().default("Published"),
    learningOutcomes: z.array(z.string().trim()).optional().default([]),
    requirements: z.array(z.string().trim()).optional().default([]),
  }),
});

const courseUpdateSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(3, "Course title must be at least 3 characters")
      .max(100, "Course title cannot exceed 100 characters")
      .optional(),
    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters long")
      .optional(),
    price: z
      .number()
      .nonnegative("Price must be a non-negative number")
      .optional(),
    duration: z
      .string()
      .trim()
      .min(1, "Duration is required")
      .optional(),
    lessons: z
      .array(lessonSchema)
      .optional(),
    thumbnail: z.string().trim().optional(),
    
    // Optional catalog filter fields
    category: z.string().trim().optional(),
    level: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
    status: z.enum(["Draft", "Published"]).optional(),
    learningOutcomes: z.array(z.string().trim()).optional(),
    requirements: z.array(z.string().trim()).optional(),
  }),
});

// Progress schema
const progressSchema = z.object({
  body: z.object({
    lessonIndex: z
      .number({ required_error: "lessonIndex is required" })
      .nonnegative("lessonIndex must be a non-negative integer"),
    time: z
      .number({ required_error: "time is required" })
      .nonnegative("time must be a non-negative number"),
  }),
});

export {
  objectIdSchema,
  registerSchema,
  loginSchema,
  courseSchema,
  courseUpdateSchema,
  progressSchema,
};
