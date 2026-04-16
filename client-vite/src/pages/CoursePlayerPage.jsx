import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const CoursePlayerPage = () => {
  const { id } = useParams();
  const videoRef = useRef();

  const [course, setCourse] = useState(null);
  const [lessonIndex, setLessonIndex] = useState(0);

  // ================= FETCH COURSE + PROGRESS =================
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
    if (!course) return;

    const lesson = course.lessons[lessonIndex];

    // Only save if video exists
    if (!lesson?.videoUrl) return;

    const interval = setInterval(() => {
      if (videoRef.current) {
        api.post(`/courses/${id}/progress`, {
          lessonIndex,
          time: videoRef.current.currentTime,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [lessonIndex, course, id]);

  if (!course) return <p className="text-center mt-10">Loading...</p>;

  const lesson = course.lessons[lessonIndex];

  return (
    <div className="flex max-w-6xl mx-auto p-6 gap-6">

      {/* ================= LEFT SIDE (LESSONS LIST) ================= */}
      <div className="w-1/3 border rounded p-4 bg-gray-50">

        <h2 className="font-bold mb-3">Lessons</h2>

        {course.lessons.map((l, i) => (
          <div
            key={i}
            onClick={() => setLessonIndex(i)}
            className={`p-2 rounded cursor-pointer mb-2 ${
              i === lessonIndex
                ? "bg-indigo-200"
                : "hover:bg-gray-200"
            }`}
          >
            {l.title}
          </div>
        ))}
      </div>

      {/* ================= RIGHT SIDE (PLAYER) ================= */}
      <div className="w-2/3">

        <h2 className="text-2xl font-bold">{lesson.title}</h2>

        {/* 🎥 VIDEO */}
        {lesson.videoUrl && (
          <video
            ref={videoRef}
            src={lesson.videoUrl}
            controls
            className="w-full mt-4 rounded shadow"
          />
        )}

        {/* 📝 TEXT CONTENT */}
        {lesson.content && (
          <p className="mt-4 text-gray-700 leading-relaxed">
            {lesson.content}
          </p>
        )}

        {/* ⚠️ EMPTY CASE */}
        {!lesson.videoUrl && !lesson.content && (
          <p className="text-red-500 mt-4">
            No content available
          </p>
        )}
      </div>
    </div>
  );
};

export default CoursePlayerPage;