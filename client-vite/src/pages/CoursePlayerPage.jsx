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
    const saveProgress = async () => {
      try {
        await api.post(`/courses/${id}/progress`, {
          lessonIndex,
          time: videoRef.current?.currentTime || 0,
        });
      } catch (err) {
        console.error(err);
      }
    };

    saveProgress();
  }, [lessonIndex, id]);

  if (!course) return <p className="text-center mt-10">Loading...</p>;

  const lesson = course.lessons?.[lessonIndex];
  if (!lesson) return <p>No lesson found</p>;

  // ================= NEXT =================
  const nextLesson = async () => {
    if (lessonIndex < course.lessons.length - 1) {
      const newIndex = lessonIndex + 1;
      setLessonIndex(newIndex);

      await api.post(`/courses/${id}/progress`, {
        lessonIndex: newIndex,
        time: 0,
      });
    }
  };

  // ================= PREVIOUS =================
  const prevLesson = () => {
    if (lessonIndex > 0) {
      setLessonIndex(lessonIndex - 1);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
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

      {/* PLAYER */}
      <div className="flex-1 p-6 overflow-y-auto">

        <h2 className="text-xl font-semibold mb-4">
          {lesson.title}
        </h2>

        {/* VIDEO */}
        {lesson.videoUrl && (
          <video
            ref={videoRef}
            src={lesson.videoUrl}
            controls
            autoPlay
            onEnded={nextLesson} // 🔥 AUTO NEXT
            className="w-full rounded-lg"
          />
        )}

        {/* TEXT */}
        {lesson.content && (
          <p className="mt-4 text-gray-700">{lesson.content}</p>
        )}

        {/* CONTROLS */}
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