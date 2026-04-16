import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const CoursePlayerPage = () => {
  const { id } = useParams();
  const videoRef = useRef();

  const [course, setCourse] = useState(null);
  const [lessonIndex, setLessonIndex] = useState(0);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data.course);

        const progress = await api.get(`/courses/${id}/progress`);
        setLessonIndex(progress.data.lessonIndex || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  // ================= SAVE PROGRESS =================
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current) {
        api.post(`/courses/${id}/progress`, {
          lessonIndex,
          time: videoRef.current.currentTime,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [lessonIndex]);

  if (!course) return <p className="text-center mt-10">Loading...</p>;

  const lesson = course.lessons?.[lessonIndex];

  if (!lesson) return <p>No lesson found</p>;

  // ================= NEXT / PREVIOUS =================
  const nextLesson = () => {
    if (lessonIndex < course.lessons.length - 1) {
      setLessonIndex(lessonIndex + 1);
    }
  };

  const prevLesson = () => {
    if (lessonIndex > 0) {
      setLessonIndex(lessonIndex - 1);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* ================= SIDEBAR ================= */}
      <div className="w-1/4 bg-white border-r overflow-y-auto">

        <h2 className="p-4 font-semibold text-lg border-b">
          Course Content
        </h2>

        {course.lessons.map((l, i) => (
          <div
            key={i}
            onClick={() => setLessonIndex(i)}
            className={`p-4 cursor-pointer border-b text-sm ${
              i === lessonIndex
                ? "bg-indigo-100 text-indigo-700 font-medium"
                : "hover:bg-gray-50"
            }`}
          >
            {i + 1}. {l.title}
          </div>
        ))}

      </div>

      {/* ================= MAIN PLAYER ================= */}
      <div className="flex-1 p-6 overflow-y-auto">

        <h2 className="text-xl font-semibold mb-4">
          {lesson.title}
        </h2>

        {/* 🎬 VIDEO */}
        {lesson.videoUrl && (
          <video
            ref={videoRef}
            src={lesson.videoUrl}
            controls
            autoPlay
            className="w-full rounded-lg"
            onEnded={nextLesson} // 🔥 AUTO NEXT
          />
        )}

        {/* 📝 TEXT */}
        {lesson.content && (
          <p className="mt-4 text-gray-700">{lesson.content}</p>
        )}

        {/* ⚠️ EMPTY */}
        {!lesson.videoUrl && !lesson.content && (
          <p className="text-red-500 mt-4">
            No content available
          </p>
        )}

        {/* ================= CONTROLS ================= */}
        <div className="flex justify-between mt-6">

          <button
            onClick={prevLesson}
            disabled={lessonIndex === 0}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={nextLesson}
            disabled={lessonIndex === course.lessons.length - 1}
            className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
};

export default CoursePlayerPage;