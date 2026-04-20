import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../utils/api";

const HomePage = () => {
  const { auth } = useContext(AuthContext);

  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (auth.user?.role === "Instructor") {
          const res = await api.get("/courses/instructor/my-courses");
          setMyCourses(res.data.courses || []);
        } else {
          const res = await api.get("/courses");
          setCourses(res.data.courses || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!auth.loading) fetchData();
  }, [auth]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* ================= HERO ================= */}
      {!auth.isAuthenticated && (
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-500 text-white py-24 overflow-hidden">

          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_left,_white,_transparent)]"></div>

          <div className="max-w-6xl mx-auto px-6 text-center relative z-10">

            <h1 className="text-5xl font-bold leading-tight">
              Upgrade Your Skills.
              <br />
              Build Your Future.
            </h1>

            <p className="mt-5 text-lg text-indigo-100 max-w-2xl mx-auto">
              Learn from industry experts with real-world courses designed to
              boost your career.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <Link to="/courses">
                <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold shadow hover:scale-105 transition">
                  Explore Courses
                </button>
              </Link>

              <Link to="/register">
                <button className="border border-white px-6 py-3 rounded-lg hover:bg-white/10 transition">
                  Get Started
                </button>
              </Link>
            </div>

          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* ================= INSTRUCTOR ================= */}
        {auth.user?.role === "Instructor" && (
          <>
            <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white p-6 rounded-xl mb-10 flex justify-between items-center shadow">

              <div>
                <h1 className="text-2xl font-semibold">
                  Welcome, {auth.user?.name}
                </h1>
                <p className="text-indigo-100">
                  Manage and grow your courses
                </p>
              </div>

              <Link to="/create-course">
                <button className="bg-white text-indigo-600 px-4 py-2 rounded shadow">
                  + Create Course
                </button>
              </Link>

            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {myCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-gradient-to-br from-white to-indigo-50 border rounded-xl p-5 shadow hover:shadow-lg transition"
                >
                  <h3 className="font-semibold text-gray-900">
                    {course.title}
                  </h3>

                  <div className="flex gap-2 mt-4">
                    <Link to={`/edit-course/${course._id}`}>
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded">
                        Edit
                      </button>
                    </Link>

                    <Link to={`/course/${course._id}`}>
                      <button className="bg-indigo-600 text-white px-3 py-1 rounded">
                        View
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ================= STUDENT ================= */}
        {auth.user?.role === "Student" && (
          <>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 rounded-xl mb-10 flex justify-between items-center shadow">

              <div>
                <h1 className="text-2xl font-semibold">
                  Welcome back, {auth.user?.name}
                </h1>
                <p className="text-indigo-100">
                  Continue your learning journey
                </p>
              </div>

              <Link to="/courses">
                <button className="bg-white text-indigo-600 px-4 py-2 rounded shadow">
                  Browse Courses
                </button>
              </Link>

            </div>

            <h2 className="text-xl font-semibold mb-6">
              Explore Courses
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow hover:shadow-xl transition p-5 border"
                >

                  <h3 className="font-semibold text-gray-900">
                    {course.title}
                  </h3>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex justify-between text-sm text-gray-500 mt-3">
                    <span>{course.lessons?.length || 0} lessons</span>
                    <span className="text-indigo-600 font-medium">
                      ₹{course.price || 0}
                    </span>
                  </div>

                  <Link to={`/course/${course._id}`}>
                    <button className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-2 rounded-lg hover:opacity-90 transition">
                      View Course
                    </button>
                  </Link>

                </div>
              ))}
            </div>
          </>
        )}

        {/* ================= GUEST COURSES ================= */}
        {!auth.isAuthenticated && (
          <>
            <h2 className="text-2xl font-semibold text-center mt-16 mb-8">
              Popular Courses
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course) => (
                <div
                  key={course._id}
                  className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
                >
                  <h3 className="font-semibold">{course.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {course.description}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default HomePage;