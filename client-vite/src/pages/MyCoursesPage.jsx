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

        // 👨‍🏫 Instructor → created courses
        if (auth.user?.role === "Instructor") {
          res = await api.get("/courses/instructor/my-courses");
        }

        // 🎓 Student → enrolled courses
        else {
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
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        {auth.user?.role === "Instructor"
          ? "My Created Courses"
          : "My Learning"}
      </h1>

      {/* ➕ CREATE BUTTON (ONLY INSTRUCTOR) */}
      {auth.user?.role === "Instructor" && (
        <button
          onClick={() => navigate("/create-course")}
          className="bg-green-600 text-white px-4 py-2 rounded mb-4"
        >
          + Create Course
        </button>
      )}

      {/* COURSES */}
      {courses.length === 0 ? (
        <p>
          {auth.user?.role === "Instructor"
            ? "No courses created yet"
            : "No enrolled courses"}
        </p>
      ) : (
        courses.map((course) => (
          <div key={course._id} className="border p-4 rounded mb-4">

            <h3 className="text-xl font-bold">{course.title}</h3>

            {/* 👨‍🏫 INSTRUCTOR ACTIONS */}
            {auth.user?.role === "Instructor" ? (
              <div className="flex gap-3 mt-3">

                <button
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="bg-indigo-600 text-white px-3 py-1 rounded"
                >
                  View
                </button>

                <button
                  onClick={() => navigate(`/edit-course/${course._id}`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

              </div>
            ) : (
              // 🎓 STUDENT ACTION
              <button
                onClick={() => navigate(`/course/${course._id}`)}
                className="bg-indigo-600 text-white px-3 py-1 rounded mt-3"
              >
                Continue Learning
              </button>
            )}

          </div>
        ))
      )}
    </div>
  );
};

export default MyCoursesPage;