import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const CoursePlayerPage = () => {
  const { id } = useParams();
  const videoRef = useRef();

  const [course, setCourse] = useState(null);
  const [lessonIndex, setLessonIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get(`/courses/${id}`);
      setCourse(res.data.course);

      const progress = await api.get(`/courses/${id}/progress`);
      setLessonIndex(progress.data.lessonIndex || 0);
    };

    fetchData();
  }, [id]);

  // 👉 SAVE PROGRESS
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

  if (!course) return <p>Loading...</p>;

  const lesson = course.lessons[lessonIndex];

  return (
    <div className="flex p-6">

      {/* LEFT - Lessons */}
      <div className="w-1/3">
        {course.lessons.map((l, i) => (
          <div
            key={i}
            onClick={() => setLessonIndex(i)}
            className={`p-2 cursor-pointer ${
              i === lessonIndex ? "bg-indigo-200" : ""
            }`}
          >
            {l.title}
          </div>
        ))}
      </div>

      {/* RIGHT - Player */}
      <div className="w-2/3 pl-4">
        <h2 className="text-xl font-bold">{lesson.title}</h2>

        <video
          ref={videoRef}
          src={lesson.videoUrl}
          controls
          className="w-full mt-4"
        />

        <p className="mt-2">{lesson.content}</p>
      </div>
    </div>
  );
};

export default CoursePlayerPage;