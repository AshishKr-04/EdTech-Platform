import express from "express";
const router = express.Router();
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

import authMiddleware from "../middleware/auth.js";
import restrictTo from "../middleware/restrictTo.js";
import AppError from "../middleware/AppError.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/video",
  authMiddleware,
  restrictTo("Instructor"),
  upload.single("video"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return next(new AppError("No video file uploaded", 400));
      }

      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "video" },
        (error, result) => {
          if (error) {
            return next(new AppError("Cloudinary media upload failed", 500));
          }
          res.json({ url: result.secure_url });
        }
      );

      stream.end(req.file.buffer);
    } catch (err) {
      next(err);
    }
  }
);

export default router;