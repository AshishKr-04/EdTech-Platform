// :contentReference[oaicite:6]{index=6}
const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/video", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "video" },
      (error, result) => {
        if (error) return res.status(500).json({ message: "Upload failed" });
        res.json({ url: result.secure_url });
      }
    );

    stream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;