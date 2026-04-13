const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/upload/video
router.post("/video", upload.single("video"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "video" },
      (error, result) => {
        if (error) return res.status(500).json(error);

        res.json({
          url: result.secure_url,
        });
      }
    );

    result.end(req.file.buffer);

  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
});

module.exports = router;