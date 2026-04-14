import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const CourseDetailPage = () => {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [resumeTime, setResumeTime] = useState(0);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await api.get(`/courses/${id}`);
        setCourse(courseRes.data.course);

        const progressRes = await api.get(`/courses/${id}/progress`);
        setCurrentLessonIndex(progressRes.data.lessonIndex || 0);
        setResumeTime(progressRes.data.time || 0);

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  if (!course) return <p className="text-center mt-10">Loading...</p>;

  const lessons = course.lessons || [];
  const currentLesson = lessons[currentLessonIndex];

  return (
    <div className="flex h-screen">

      {/* 📚 SIDEBAR */}
      <div className="w-1/3 bg-gray-100 overflow-y-auto p-4">

        <h2 className="text-xl font-bold mb-4">
          {course.title}
        </h2>

        {lessons.map((lesson, index) => (
          <div
            key={index}
            onClick={() => {
              setCurrentLessonIndex(index);
              setResumeTime(0);
            }}
            className={`p-3 mb-2 rounded cursor-pointer ${
              index === currentLessonIndex
                ? "bg-indigo-500 text-white"
                : "bg-white"
            }`}
          >
            <p className="font-semibold">
              Lesson {index + 1}
            </p>
            <p className="text-sm">{lesson.title}</p>
          </div>
        ))}
      </div>

      {/* 🎥 VIDEO PLAYER */}
      <div className="w-2/3 p-6">

        <h2 className="text-2xl font-bold mb-4">
          {currentLesson.title}
        </h2>

        <ReactPlayer
          url={currentLesson.videoUrl}
          controls
          width="100%"
          height="400px"

          // ▶️ Resume playback
          onReady={(player) => {
            if (resumeTime) {
              player.seekTo(resumeTime);
            }
          }}

          // ⏱ Track progress
          onProgress={({ playedSeconds }) => {
            setResumeTime(playedSeconds);
          }}

          // 💾 Save progress
          onPause={() => {
            api.post(`/courses/${id}/progress`, {
              lessonIndex: currentLessonIndex,
              time: resumeTime,
            });
          }}

          // ⏭ AUTO NEXT LESSON
          onEnded={() => {
            if (currentLessonIndex < lessons.length - 1) {
              setCurrentLessonIndex(currentLessonIndex + 1);
              setResumeTime(0);
            }
          }}
        />

        {/* 📄 CONTENT */}
        <p className="mt-4 text-gray-600">
          {currentLesson.content}
        </p>

      </div>
    </div>
  );
};

export default CourseDetailPage;