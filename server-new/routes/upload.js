const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const authMiddleware = require("../middleware/auth");
const restrictTo = require("../middleware/restrictTo");
const AppError = require("../middleware/AppError");

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

module.exports = router;