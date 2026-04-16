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
    };
    fetchData();
  }, [id]);

  if (!course) return <p>Loading...</p>;

  const lesson = course.lessons[lessonIndex];

  return (
    <div className="flex p-6">

      <div className="w-1/3">
        {course.lessons.map((l, i) => (
          <div key={i} onClick={() => setLessonIndex(i)}>
            {l.title}
          </div>
        ))}
      </div>

      <div className="w-2/3">

        <h2>{lesson.title}</h2>

        {lesson.videoUrl && (
          <video
            ref={videoRef}
            src={lesson.videoUrl}
            controls
            className="w-full"
          />
        )}

        {lesson.content && <p>{lesson.content}</p>}

        {!lesson.videoUrl && !lesson.content && (
          <p>No content</p>
        )}
      </div>
    </div>
  );
};

export default CoursePlayerPage;