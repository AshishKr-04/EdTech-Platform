import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const CreateCoursePage = () => {
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    lessons: [
      { title: "", content: "", videoUrl: "" }
    ],
  });

  const handleChange = (e) => {
    setCourseData({
      ...courseData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ LESSON CHANGE
  const handleLessonChange = (index, e) => {
    const updatedLessons = [...courseData.lessons];
    updatedLessons[index][e.target.name] = e.target.value;

    setCourseData({
      ...courseData,
      lessons: updatedLessons,
    });
  };

  // ✅ ADD LESSON
  const addLesson = () => {
    setCourseData({
      ...courseData,
      lessons: [
        ...courseData.lessons,
        { title: "", content: "", videoUrl: "" }
      ],
    });
  };

  // ✅ REMOVE LESSON
  const removeLesson = (index) => {
    const updatedLessons = courseData.lessons.filter((_, i) => i !== index);

    setCourseData({
      ...courseData,
      lessons: updatedLessons,
    });
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/courses", courseData);

      alert("Course Created Successfully 🎉");
      navigate("/my-courses");

    } catch (err) {
      console.error(err);
      alert("Error creating course");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">Create Course</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* BASIC DETAILS */}
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Course Description"
          className="w-full border p-3 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

        <input
          type="text"
          name="duration"
          placeholder="Duration (e.g. 5 hours)"
          className="w-full border p-3 rounded"
          onChange={handleChange}
        />

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
                placeholder="Lesson Title"
                className="w-full border p-2 mb-2 rounded"
                value={lesson.title}
                onChange={(e) => handleLessonChange(index, e)}
                required
              />

              <textarea
                name="content"
                placeholder="Lesson Content"
                className="w-full border p-2 mb-2 rounded"
                value={lesson.content}
                onChange={(e) => handleLessonChange(index, e)}
                required
              />

              <input
                type="text"
                name="videoUrl"
                placeholder="Video URL (optional)"
                className="w-full border p-2 mb-2 rounded"
                value={lesson.videoUrl}
                onChange={(e) => handleLessonChange(index, e)}
              />

              {/* REMOVE BUTTON */}
              {courseData.lessons.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLesson(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Remove Lesson
                </button>
              )}
            </div>
          ))}

          {/* ADD BUTTON */}
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