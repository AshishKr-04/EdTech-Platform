import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    lessons: [],
  });

  const [uploadProgress, setUploadProgress] = useState({});

  useEffect(() => {
    const fetchCourse = async () => {
      const res = await api.get(`/courses/${id}`);
      const course = res.data.course;

      setCourseData({
        title: course.title || "",
        description: course.description || "",
        price: course.price || "",
        duration: course.duration || "",
        lessons: course.lessons || [],
      });
    };

    fetchCourse();
  }, [id]);

  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleLessonChange = (index, e) => {
    const updated = [...courseData.lessons];
    updated[index][e.target.name] = e.target.value || "";
    setCourseData({ ...courseData, lessons: updated });
  };

  const addLesson = () => {
    setCourseData({
      ...courseData,
      lessons: [
        ...courseData.lessons,
        { title: "", content: "", videoUrl: "" },
      ],
    });
  };

  const removeLesson = (index) => {
    const updated = courseData.lessons.filter((_, i) => i !== index);
    setCourseData({ ...courseData, lessons: updated });
  };

  const handleVideoUpload = async (index, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    const res = await api.post("/upload/video", formData, {
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ flexible validation
    const invalid = courseData.lessons.some(
      (l) => !l.title || (!l.content && !l.videoUrl)
    );

    if (invalid) {
      return alert("Each lesson must have title + text OR video");
    }

    await api.put(`/courses/${id}`, courseData);
    alert("Course updated 🎉");
    navigate("/instructor-dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <input
          name="title"
          value={courseData.title || ""}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />

        <textarea
          name="description"
          value={courseData.description || ""}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            value={courseData.price || ""}
            onChange={handleChange}
            placeholder="Price"
            className="border p-3 rounded"
          />

          <input
            type="text"
            name="duration"
            value={courseData.duration || ""}
            onChange={handleChange}
            placeholder="Duration"
            className="border p-3 rounded"
          />
        </div>

        {courseData.lessons.map((lesson, index) => (
          <div key={index} className="border p-4 mb-4">

            <input
              name="title"
              value={lesson.title || ""}
              onChange={(e) => handleLessonChange(index, e)}
              className="w-full border p-2 mb-2"
            />

            <textarea
              name="content"
              value={lesson.content || ""}
              onChange={(e) => handleLessonChange(index, e)}
              className="w-full border p-2 mb-2"
            />

            <input
              type="file"
              onChange={(e) =>
                handleVideoUpload(index, e.target.files[0])
              }
            />

            {uploadProgress[index] && (
              <p>Upload: {uploadProgress[index]}%</p>
            )}

            <button
              type="button"
              onClick={() => removeLesson(index)}
              className="bg-red-500 text-white px-2 py-1 mt-2"
            >
              Delete
            </button>

          </div>
        ))}

        <button type="button" onClick={addLesson}>
          + Add Lesson
        </button>

        <button type="submit" className="bg-indigo-600 text-white w-full py-3">
          Save Changes
        </button>

      </form>
    </div>
  );
};

export default EditCoursePage;