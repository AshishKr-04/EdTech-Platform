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
  const [error, setError] = useState("");

  // ✅ FETCH COURSE + PROGRESS
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const courseRes = await api.get(`/courses/${id}`);

        // 🔥 IMPORTANT FIX
        const fetchedCourse = courseRes.data?.course || courseRes.data;

        if (!fetchedCourse || !fetchedCourse._id) {
          throw new Error("Invalid course data");
        }

        setCourse(fetchedCourse);

        // ✅ Fetch progress safely
        try {
          const progressRes = await api.get(`/courses/${id}/progress`);
          setCompletedLessons(progressRes.data.completedLessons || []);
        } catch {
          setCompletedLessons([]);
        }

        // ✅ FIXED ENROLL CHECK (safe)
        const enrolled = auth.user?.enrolledCourses?.some(
          (courseId) => courseId.toString() === id
        );

        setIsEnrolled(enrolled || false);

      } catch (err) {
        console.error(err);
        setError("Course not found or failed to load");
      } finally {
        setLoading(false);
      }
    };

    if (!auth.loading) {
      fetchData();
    }
  }, [id, auth]);

  // ✅ ENROLL FUNCTION
  const handleEnroll = async () => {
    try {
      await api.post(`/courses/${id}/enroll`);
      alert("Enrolled Successfully 🎉");
      navigate("/my-courses");
    } catch (err) {
      console.error(err);
      alert("Enrollment failed");
    }
  };

  // ✅ MARK LESSON COMPLETE
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

  // ✅ SAFE STATES
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
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
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-4xl font-bold">{course.title}</h1>
            <p className="mt-2 text-gray-300">{course.description}</p>
            <p className="mt-4">
              Instructor:{" "}
              <span className="font-semibold">
                {course.instructor?.name}
              </span>
            </p>
          </div>

          {isCreator && (
            <Link
              to={`/edit-course/${course._id}`}
              className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
            >
              Edit Course
            </Link>
          )}
        </div>
      </div>

      {/* PROGRESS BAR */}
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
      <div className="space-y-4">
        {lessons.length === 0 ? (
          <p>No lessons added yet</p>
        ) : (
          lessons.map((lesson, index) => (
            <div key={index} className="border rounded p-4">

              <h3 className="font-bold text-lg">
                Lesson {index + 1}: {lesson.title}
              </h3>

              <p className="text-gray-600 mt-2">
                {lesson.content}
              </p>

              {/* VIDEO */}
              {lesson.videoUrl && (
                <video
                  src={lesson.videoUrl}
                  controls
                  className="mt-3 w-full rounded"
                />
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

      {/* ENROLL BUTTON */}
      {auth.isAuthenticated &&
        auth.user?.role === "Student" &&
        !isEnrolled && (
          <button
            onClick={handleEnroll}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
          >
            Enroll Now (₹{course.price})
          </button>
        )}

      {/* ALREADY ENROLLED */}
      {isEnrolled && (
        <button className="mt-6 w-full bg-gray-500 text-white py-3 rounded cursor-not-allowed">
          Already Enrolled ✅
        </button>
      )}
    </div>
  );
};

export default CourseDetailPage;