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

  const [loading, setLoading] = useState(true);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  // ================= FETCH COURSE =================
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        const course = res.data.course || res.data;

        setCourseData({
          title: course.title,
          description: course.description,
          price: course.price,
          duration: course.duration,
          lessons: course.lessons || [],
        });

      } catch (err) {
        console.error(err);
        alert("Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // ================= BASIC CHANGE =================
  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= LESSON CHANGE =================
  const handleLessonChange = (index, e) => {
    const updatedLessons = [...courseData.lessons];
    updatedLessons[index][e.target.name] = e.target.value;

    setCourseData({
      ...courseData,
      lessons: updatedLessons,
    });
  };

  // ================= ADD LESSON =================
  const addLesson = () => {
    setCourseData({
      ...courseData,
      lessons: [
        ...courseData.lessons,
        { title: "", content: "", videoUrl: "" }
      ],
    });
  };

  // ================= REMOVE LESSON =================
  const removeLesson = (index) => {
    const updatedLessons = courseData.lessons.filter((_, i) => i !== index);

    setCourseData({
      ...courseData,
      lessons: updatedLessons,
    });
  };

  // ================= VIDEO UPLOAD =================
  const handleVideoUpload = async (index, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    try {
      setUploadingIndex(index);

      const res = await api.post("/upload/video", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedLessons = [...courseData.lessons];
      updatedLessons[index].videoUrl = res.data.url;

      setCourseData({
        ...courseData,
        lessons: updatedLessons,
      });

      alert("Video uploaded successfully 🎉");

    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploadingIndex(null);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/courses/${id}`, courseData);

      alert("Course updated successfully 🎉");
      navigate("/my-courses");

    } catch (err) {
      console.error(err);
      alert("Error updating course");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">Edit Course</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* BASIC INFO */}
        <input
          type="text"
          name="title"
          value={courseData.title}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Course Title"
        />

        <textarea
          name="description"
          value={courseData.description}
          onChange={handleChange}
          className="w-full border p-3 rounded"
          placeholder="Description"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="price"
            value={courseData.price}
            onChange={handleChange}
            className="border p-3 rounded"
            placeholder="Price"
          />

          <input
            type="text"
            name="duration"
            value={courseData.duration}
            onChange={handleChange}
            className="border p-3 rounded"
            placeholder="Duration"
          />
        </div>

        {/* LESSON BUILDER */}
        <div>
          <h2 className="text-xl font-bold mb-3">Lessons</h2>

          {courseData.lessons.map((lesson, index) => (
            <div key={index} className="border p-4 mb-4 rounded">

              <h3 className="font-semibold mb-2">
                Lesson {index + 1}
              </h3>

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
                placeholder="Lesson Content"
                className="w-full border p-2 mb-2 rounded"
              />

              {/* VIDEO URL */}
              <input
                type="text"
                name="videoUrl"
                value={lesson.videoUrl}
                onChange={(e) => handleLessonChange(index, e)}
                placeholder="Paste Video URL (optional)"
                className="w-full border p-2 mb-2 rounded"
              />

              {/* 🎥 VIDEO UPLOAD */}
              <input
                type="file"
                accept="video/*"
                className="mb-2"
                onChange={(e) =>
                  handleVideoUpload(index, e.target.files[0])
                }
              />

              {/* UPLOADING STATUS */}
              {uploadingIndex === index && (
                <p className="text-blue-500 text-sm">
                  Uploading video...
                </p>
              )}

              {/* DELETE */}
              <button
                type="button"
                onClick={() => removeLesson(index)}
                className="bg-red-500 text-white px-3 py-1 rounded mt-2"
              >
                Delete Lesson
              </button>
            </div>
          ))}

          {/* ADD LESSON */}
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
          Save Changes
        </button>

      </form>
    </div>
  );
};

export default EditCoursePage;