import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const CourseDetailPage = () => {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [resumeTime, setResumeTime] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);

  // FETCH COURSE
  useEffect(() => {
    const fetchData = async () => {
      const courseRes = await api.get(`/courses/${id}`);
      setCourse(courseRes.data.course);

      const progressRes = await api.get(`/courses/${id}/progress`);
      setResumeTime(progressRes.data.time);
      setLessonIndex(progressRes.data.lessonIndex);
    };

    fetchData();
  }, [id]);

  if (!course) return <p>Loading...</p>;

  const lesson = course.lessons[lessonIndex];

  return (
    <div>

      <h1>{course.title}</h1>

      {/* 🎥 PLAYER */}
      <ReactPlayer
        url={lesson.videoUrl}
        controls
        width="100%"
        height="400px"

        onReady={(player) => {
          if (resumeTime) {
            player.seekTo(resumeTime);
          }
        }}

        onProgress={({ playedSeconds }) => {
          setResumeTime(playedSeconds);
        }}

        onPause={async () => {
          await api.post(`/courses/${id}/progress`, {
            lessonIndex,
            time: resumeTime,
          });
        }}
      />

    </div>
  );
};

export default CourseDetailPage;