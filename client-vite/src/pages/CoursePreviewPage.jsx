import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

const CoursePreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  // ================= FETCH COURSE =================
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${id}`);

        setCourse(res.data.course);
        setIsEnrolled(res.data.isEnrolled);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  // ================= ENROLL =================
  const handleEnroll = async () => {
    try {
      await api.post(`/courses/${id}/enroll`);

      alert("Enrolled successfully 🎉");

      // 🔥 update UI instantly
      setIsEnrolled(true);

      // redirect
      navigate(`/learn/${id}`);
    } catch (err) {
      console.error(err);
      alert("Enrollment failed");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>Course not found</p>;

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

      {/* 🔥 CONDITIONAL BUTTON */}
      {isEnrolled ? (
        <button
          onClick={() => navigate(`/learn/${id}`)}
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded"
        >
          Continue Learning
        </button>
      ) : (
        <button
          onClick={handleEnroll}
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded"
        >
          Enroll Now
        </button>
      )}

    </div>
  );
};

export default CoursePreviewPage;