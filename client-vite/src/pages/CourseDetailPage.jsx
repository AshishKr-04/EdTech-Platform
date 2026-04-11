import ReactPlayer from "react-player";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";


const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  const [course, setCourse] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await api.get(`/courses/${id}`);
        const fetchedCourse = courseRes.data.course || courseRes.data;

        setCourse(fetchedCourse);

        // Progress
        try {
          const progressRes = await api.get(`/courses/${id}/progress`);
          setCompletedLessons(progressRes.data.completedLessons || []);
        } catch {
          setCompletedLessons([]);
        }

        // Enrollment check
        const enrolled = auth.user?.enrolledCourses?.some(
          (c) => c.toString() === id
        );

        setIsEnrolled(enrolled || false);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!auth.loading) fetchData();
  }, [id, auth]);

  // ================= ENROLL =================
  const handleEnroll = async () => {
    try {
      await api.post(`/courses/${id}/enroll`);
      alert("Enrolled Successfully 🎉");
      navigate("/my-courses");
    } catch (err) {
      alert("Enrollment failed");
    }
  };

  // ================= MARK COMPLETE =================
  const markComplete = async (index) => {
    try {
      await api.post(`/courses/${id}/progress`, {
        lessonIndex: index,
      });

      setCompletedLessons((prev) =>
        prev.includes(index) ? prev : [...prev, index]
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!course) return <p className="text-center">Course not found</p>;

  const lessons = course.lessons || [];

  const progressPercent =
    lessons.length > 0
      ? (completedLessons.length / lessons.length) * 100
      : 0;

  const isCreator =
    auth.user?._id === course.instructor?._id;

  return (
    <div className="container mx-auto px-4 py-8">

      {/* HEADER */}
      <div className="bg-gray-800 text-white p-8 rounded-lg mb-8">
        <div className="flex justify-between">
          <div>
            <h1 className="text-4xl font-bold">{course.title}</h1>
            <p className="mt-2 text-gray-300">{course.description}</p>
            <p className="mt-4">
              Instructor: <b>{course.instructor?.name}</b>
            </p>
          </div>

          {isCreator && (
            <Link
              to={`/edit-course/${course._id}`}
              className="bg-green-500 px-4 py-2 rounded"
            >
              Edit Course
            </Link>
          )}
        </div>
      </div>

      {/* PROGRESS */}
      <div className="mb-6">
        <p className="font-semibold">
          Progress: {Math.round(progressPercent)}%
        </p>

        <div className="w-full bg-gray-200 rounded h-3 mt-2">
          <div
            className="bg-indigo-600 h-3 rounded"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* LESSONS */}
      <div className="space-y-6">
        {lessons.length === 0 ? (
          <p>No lessons added yet</p>
        ) : (
          lessons.map((lesson, index) => (
            <div key={index} className="border p-4 rounded">

              <h3 className="font-bold text-lg">
                Lesson {index + 1}: {lesson.title}
              </h3>

              <p className="text-gray-600 mt-2">
                {lesson.content}
              </p>

              {/* 🎥 REACT PLAYER */}
              {lesson.videoUrl && (
                <div className="mt-4 rounded-lg overflow-hidden shadow">
  <ReactPlayer
    url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    controls
    width="100%"
    height="360px"
  />
</div>
              )}

              {/* COMPLETE BUTTON */}
              {isEnrolled && (
                <button
                  onClick={() => markComplete(index)}
                  className={`mt-3 px-3 py-1 rounded ${
                    completedLessons.includes(index)
                      ? "bg-green-500 text-white"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  {completedLessons.includes(index)
                    ? "Completed ✅"
                    : "Mark Complete"}
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* ENROLL */}
      {auth.isAuthenticated &&
        auth.user?.role === "Student" &&
        !isEnrolled && (
          <button
            onClick={handleEnroll}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded"
          >
            Enroll Now (₹{course.price})
          </button>
        )}

      {/* ENROLLED */}
      {isEnrolled && (
        <button className="mt-6 w-full bg-gray-500 text-white py-3 rounded">
          Already Enrolled ✅
        </button>
      )}
    </div>
  );
};

export default CourseDetailPage;