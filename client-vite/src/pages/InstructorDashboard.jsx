import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const InstructorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ================= FETCH ANALYTICS =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/courses/instructor/analytics");
        setData(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="text-center mt-10 animate-pulse">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📊 Instructor Dashboard</h1>

        {/* ➕ CREATE COURSE */}
        <button
          onClick={() => navigate("/create-course")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Create Course
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-6 mb-6">

        <div className="bg-indigo-600 text-white p-6 rounded shadow">
          <p>Total Courses</p>
          <h2 className="text-2xl font-bold">{data.totalCourses}</h2>
        </div>

        <div className="bg-green-600 text-white p-6 rounded shadow">
          <p>Total Students</p>
          <h2 className="text-2xl font-bold">{data.totalStudents}</h2>
        </div>

      </div>

      {/* COURSE PERFORMANCE */}
      <h2 className="text-xl font-semibold mb-4">Course Performance</h2>

      {data.courseStats.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p>No courses created yet 🚀</p>
          <button
            onClick={() => navigate("/create-course")}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Create Your First Course
          </button>
        </div>
      ) : (
        data.courseStats.map((course) => (
          <div key={course.courseId} className="border p-4 rounded mb-4 shadow-sm">

            <h3 className="text-lg font-bold">{course.title}</h3>

            <div className="flex justify-between text-gray-600 mt-2">
              <p>Lessons: {course.lessons}</p>
              <p>Students: {course.students}</p>
            </div>

            {/* PROGRESS BAR */}
            <div className="w-full bg-gray-200 h-2 rounded mt-3">
              <div
                className="bg-indigo-600 h-2 rounded"
                style={{
                  width: `${Math.min(course.students * 10, 100)}%`,
                }}
              ></div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-4">

              {/* VIEW (FIXED ROUTE) */}
              <button
                onClick={() => navigate(`/course/${course.courseId}`)}
                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
              >
                View
              </button>

              {/* EDIT */}
              <button
                onClick={() => navigate(`/edit-course/${course.courseId}`)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>

            </div>

          </div>
        ))
      )}
    </div>
  );
};

export default InstructorDashboard;