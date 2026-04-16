import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  // ================= FETCH =================
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let res;

        if (auth.user?.role === "Instructor") {
          res = await api.get("/courses/instructor/my-courses");
        } else {
          res = await api.get("/users/my-learning");
        }

        setCourses(res.data.courses || []);
      } catch (err) {
        console.error(err);
      }
    };

    if (auth.user) fetchCourses();
  }, [auth.user]);

  // ================= UI =================
  return (
    <div className="bg-gray-50 min-h-screen py-10 px-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          {auth.user?.role === "Instructor"
            ? "My Created Courses"
            : "My Learning"}
        </h1>

        {/* ➕ CREATE BUTTON */}
        {auth.user?.role === "Instructor" && (
          <button
            onClick={() => navigate("/create-course")}
            className="bg-green-600 text-white px-4 py-2 rounded mb-6 hover:bg-green-700"
          >
            + Create Course
          </button>
        )}

        {/* EMPTY STATE */}
        {courses.length === 0 ? (
          <p className="text-gray-500">
            {auth.user?.role === "Instructor"
              ? "No courses created yet"
              : "No enrolled courses"}
          </p>
        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between"
              >

                {/* CONTENT */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {course.title}
                  </h2>

                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex gap-4 mt-4 text-sm text-gray-500">
                    <span>{course.lessons?.length || 0} lessons</span>
                    <span>{course.duration || "N/A"}</span>
                  </div>
                </div>

                {/* ACTIONS */}
                {auth.user?.role === "Instructor" ? (
                  <div className="flex gap-2 mt-6">

                    <button
                      onClick={() => navigate(`/course/${course._id}`)}
                      className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                    >
                      View
                    </button>

                    <button
                      onClick={() => navigate(`/edit-course/${course._id}`)}
                      className="flex-1 bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                  </div>
                ) : (
                  <button
                    onClick={() => navigate(`/learn/${course._id}`)}
                    className="mt-6 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
                  >
                    Continue Learning
                  </button>
                )}

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default MyCoursesPage;