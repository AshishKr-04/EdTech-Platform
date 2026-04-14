import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const CourseDetailPage = () => {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [time, setTime] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      const c = await api.get(`/courses/${id}`);
      setCourse(c.data.course);

      const p = await api.get(`/courses/${id}/progress`);
      setTime(p.data.time);
      setLessonIndex(p.data.lessonIndex);
    };
    load();
  }, [id]);

  if (!course) return <p>Loading...</p>;

  const lesson = course.lessons[lessonIndex];

  return (
    <ReactPlayer
      url={lesson.videoUrl}
      controls
      width="100%"
      height="400px"
      onReady={(p) => p.seekTo(time)}
      onProgress={({ playedSeconds }) => setTime(playedSeconds)}
      onPause={() =>
        api.post(`/courses/${id}/progress`, { lessonIndex, time })
      }
    />
  );
};

export default CourseDetailPage;