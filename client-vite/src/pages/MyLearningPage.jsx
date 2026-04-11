import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const MyLearningPage = () => {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch course + progress
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await api.get(`/courses/${id}`);
        const progressRes = await api.get(`/courses/${id}/progress`);

        setCourse(courseRes.data.course || courseRes.data);
        setCompletedLessons(progressRes.data.completedLessons || []);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ✅ Mark lesson complete
  const markComplete = async (index) => {
    try {
      await api.post(`/courses/${id}/progress`, {
        lessonIndex: index,
      });

      setCompletedLessons((prev) =>
        prev.includes(index) ? prev : [...prev, index]
      );

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!course) return <p className="text-center">Course not found</p>;

  const lessons = course.lessons || [];
  const activeLesson = lessons[activeLessonIndex];

  const progressPercent =
    lessons.length > 0
      ? (completedLessons.length / lessons.length) * 100
      : 0;

  return (
    <div className="flex h-[80vh] border rounded overflow-hidden">

      {/* 🎯 LEFT: VIDEO PLAYER */}
      <div className="w-3/4 bg-black text-white p-4">

        <h2 className="text-xl font-bold mb-3">
          {activeLesson.title}
        </h2>

        {/* 🎥 VIDEO */}
        {activeLesson.videoUrl ? (
          <video
            src={activeLesson.videoUrl}
            controls
            className="w-full h-[60vh] rounded"
            onEnded={() => markComplete(activeLessonIndex)}
          />
        ) : (
          <div className="h-[60vh] flex items-center justify-center bg-gray-800">
            <p>No video available</p>
          </div>
        )}

        {/* CONTENT */}
        <p className="mt-4">{activeLesson.content}</p>

        {/* COMPLETE BUTTON */}
        <button
          onClick={() => markComplete(activeLessonIndex)}
          className={`mt-4 px-4 py-2 rounded ${
            completedLessons.includes(activeLessonIndex)
              ? "bg-green-500"
              : "bg-indigo-600"
          }`}
        >
          {completedLessons.includes(activeLessonIndex)
            ? "Completed ✅"
            : "Mark Complete"}
        </button>

        {/* PROGRESS BAR */}
        <div className="mt-6">
          <p>Progress: {Math.round(progressPercent)}%</p>
          <div className="w-full bg-gray-600 h-2 rounded mt-1">
            <div
              className="bg-indigo-500 h-2 rounded"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 📚 RIGHT: LESSON LIST */}
      <div className="w-1/4 bg-gray-100 overflow-y-auto">

        <h3 className="p-4 font-bold border-b">Lessons</h3>

        {lessons.map((lesson, index) => (
          <div
            key={index}
            onClick={() => setActiveLessonIndex(index)}
            className={`p-4 cursor-pointer border-b hover:bg-gray-200 ${
              index === activeLessonIndex ? "bg-gray-300" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{lesson.title}</span>

              {completedLessons.includes(index) && (
                <span className="text-green-500">✔</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyLearningPage;