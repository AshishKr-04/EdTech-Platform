// SAVE PROGRESS
router.post("/:id/progress", authMiddleware, async (req, res) => {
  try {
    const { lessonIndex, time } = req.body;

    const user = await User.findById(req.user.id);

    let progress = user.progress.find(
      (p) => p.courseId.toString() === req.params.id
    );

    if (!progress) {
      progress = {
        courseId: req.params.id,
        lessonIndex,
        time,
      };
      user.progress.push(progress);
    } else {
      progress.lessonIndex = lessonIndex;
      progress.time = time;
    }

    await user.save();

    res.json({ success: true, progress });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// GET PROGRESS
router.get("/:id/progress", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const progress = user.progress.find(
      (p) => p.courseId.toString() === req.params.id
    );

    res.json({
      lessonIndex: progress?.lessonIndex || 0,
      time: progress?.time || 0,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});