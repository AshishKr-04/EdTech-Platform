import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const CreateCoursePage = () => {
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    lessons: [{ title: "", content: "", videoUrl: "" }],
  });

  const [videoPreview, setVideoPreview] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});

  // ================= BASIC CHANGE =================
  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= LESSON CHANGE =================
  const handleLessonChange = (index, e) => {
    const updated = [...courseData.lessons];
    updated[index][e.target.name] = e.target.value;
    setCourseData({ ...courseData, lessons: updated });
  };

  // ================= ADD LESSON =================
  const addLesson = () => {
    setCourseData({
      ...courseData,
      lessons: [
        ...courseData.lessons,
        { title: "", content: "", videoUrl: "" },
      ],
    });
  };

  // ================= VIDEO UPLOAD =================
  const handleVideoUpload = async (index, file) => {
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setVideoPreview((prev) => ({ ...prev, [index]: previewUrl }));

    const formData = new FormData();
    formData.append("video", file);

    try {
      const res = await api.post("/upload/video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setUploadProgress((prev) => ({
            ...prev,
            [index]: Math.round((e.loaded * 100) / e.total),
          }));
        },
      });

      const updated = [...courseData.lessons];
      updated[index].videoUrl = res.data.url;

      setCourseData({ ...courseData, lessons: updated });

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Only check: lesson must have either text OR video
    const invalidLesson = courseData.lessons.some(
      (lesson) => !lesson.title || (!lesson.content && !lesson.videoUrl)
    );

    if (invalidLesson) {
      return alert("Each lesson must have title and either content or video");
    }

    try {
      await api.post("/courses", courseData);
      alert("Course created 🎉");
      navigate("/instructor-dashboard");
    } catch (err) {
      console.error(err);
      alert("Error creating course");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">Create Course</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* BASIC INFO */}
        <input
          type="text"
          name="title"
          value={courseData.title}
          onChange={handleChange}
          placeholder="Course Title"
          className="w-full border p-3 rounded"
        />

        <textarea
          name="description"
          value={courseData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-3 rounded"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            value={courseData.price || ""}
            onChange={handleChange}
            placeholder="Price (₹)"
            className="border p-3 rounded"
          />

          <input
            type="text"
            name="duration"
            value={courseData.duration || ""}
            onChange={handleChange}
            placeholder="Duration (e.g. 10 hours)"
            className="border p-3 rounded"
          />
        </div>

        {/* LESSONS */}
        <div>
          <h2 className="text-xl font-bold mb-3">Lessons</h2>

          {courseData.lessons.map((lesson, index) => (
            <div key={index} className="border p-4 mb-4 rounded">

              <input
                type="text"
                name="title"
                value={lesson.title}
                onChange={(e) => handleLessonChange(index, e)}
                placeholder="Lesson Title"
                className="w-full border p-2 mb-2 rounded"
              />

              <textarea
                name="content"
                value={lesson.content}
                onChange={(e) => handleLessonChange(index, e)}
                placeholder="Text content (optional)"
                className="w-full border p-2 mb-2 rounded"
              />

              <p className="text-sm text-gray-500 mb-1">
                Upload video (optional)
              </p>

              <input
                type="file"
                accept="video/*"
                onChange={(e) =>
                  handleVideoUpload(index, e.target.files[0])
                }
              />

              {/* PREVIEW */}
              {videoPreview[index] && (
                <video
                  src={videoPreview[index]}
                  controls
                  className="mt-2 w-full max-h-60"
                />
              )}

              {/* PROGRESS */}
              {uploadProgress[index] && (
                <p className="text-blue-500 text-sm mt-1">
                  Upload: {uploadProgress[index]}%
                </p>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addLesson}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            + Add Lesson
          </button>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded"
        >
          Create Course
        </button>

      </form>
    </div>
  );
};

export default CreateCoursePage;