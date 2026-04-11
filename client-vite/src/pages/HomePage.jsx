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
        // 👨‍🏫 Instructor Dashboard
        if (auth.user?.role === "Instructor") {
          const res = await api.get("/courses/instructor/my-courses");
          setMyCourses(res.data.courses || []);
        }

        // 👨‍🎓 Student Home
        else {
          const res = await api.get("/courses");
          setCourses(res.data.courses || []);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (!auth.loading) {
      fetchData();
    }
  }, [auth]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">

      {/* ================= INSTRUCTOR DASHBOARD ================= */}
      {auth.user?.role === "Instructor" ? (
        <>
          {/* HEADER */}
          <div className="bg-indigo-100 p-6 rounded-xl mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {auth.user?.name} 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your courses and grow your audience 🚀
              </p>
            </div>

            <Link to="/create-course">
              <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg">
                + Create Course
              </button>
            </Link>
          </div>

          {/* STATS */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white shadow p-5 rounded">
              <h3 className="text-gray-500">Total Courses</h3>
              <p className="text-2xl font-bold">{myCourses.length}</p>
            </div>

            <div className="bg-white shadow p-5 rounded">
              <h3 className="text-gray-500">Total Students</h3>
              <p className="text-2xl font-bold">--</p>
            </div>

            <div className="bg-white shadow p-5 rounded">
              <h3 className="text-gray-500">Revenue</h3>
              <p className="text-2xl font-bold">₹0</p>
            </div>
          </div>

          {/* COURSES */}
          <h2 className="text-xl font-bold mb-4">Your Courses</h2>

          {myCourses.length === 0 ? (
            <p>No courses yet. Create your first course 🚀</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {myCourses.map((course) => (
                <div key={course._id} className="border p-4 rounded shadow">

                  <h3 className="font-bold">{course.title}</h3>
                  <p className="text-gray-600">{course.description}</p>

                  <div className="flex gap-2 mt-4">
                    <Link to={`/edit-course/${course._id}`}>
                      <button className="bg-blue-500 text-white px-3 py-1 rounded">
                        Edit
                      </button>
                    </Link>

                    <Link to={`/course/${course._id}`}>
                      <button className="bg-gray-700 text-white px-3 py-1 rounded">
                        View
                      </button>
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        /* ================= STUDENT HOME ================= */
        <>
          <div className="bg-indigo-100 p-6 rounded-xl mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {auth.user?.name} 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Ready to continue learning?
              </p>
            </div>

            <Link to="/courses">
              <button className="bg-indigo-600 text-white px-5 py-2 rounded-lg">
                Browse Courses
              </button>
            </Link>
          </div>

          <h2 className="text-xl font-bold mb-4">Recommended for You</h2>

          {courses.length === 0 ? (
            <p>No courses available</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course._id} className="border p-4 rounded shadow">

                  <h3 className="font-bold">{course.title}</h3>
                  <p className="text-gray-600">{course.description}</p>

                  <Link to={`/course/${course._id}`}>
                    <button className="mt-3 bg-indigo-600 text-white px-3 py-1 rounded">
                      View Course
                    </button>
                  </Link>

                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;