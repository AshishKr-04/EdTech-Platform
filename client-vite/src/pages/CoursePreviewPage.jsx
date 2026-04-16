import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

const CoursePreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);
        setCourse(res.data.course);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    try {
      await api.post(`/courses/${id}/enroll`);
      alert("Enrolled successfully 🎉");

      // 👉 redirect to player
      navigate(`/learn/${id}`);
    } catch (err) {
      console.error(err);
      alert("Enrollment failed");
    }
  };

  if (!course) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold">{course.title}</h1>

      <p className="mt-2 text-gray-600">
        Instructor: {course.instructor?.name}
      </p>

      <p className="mt-4">{course.description}</p>

      <p className="mt-4 font-semibold">
        Price: ₹{course.price}
      </p>

      <button
        onClick={handleEnroll}
        className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
      >
        Enroll Now
      </button>
    </div>
  );
};

export default CoursePreviewPage;