import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

const MyCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
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

        const courseList = res.data.courses || [];
        setCourses(courseList);

        // 🔥 FETCH PROGRESS
        if (auth.user?.role !== "Instructor") {
          const progressData = {};

          await Promise.all(
            courseList.map(async (course) => {
              try {
                const p = await api.get(`/courses/${course._id}/progress`);
                progressData[course._id] = p.data.lessonIndex || 0;
              } catch {
                progressData[course._id] = 0;
              }
            })
          );

          setProgressMap(progressData);
        }

      } catch (err) {
        console.error(err);
      }
    };

    if (auth.user) fetchCourses();
  }, [auth.user]);

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-2xl font-semibold mb-6">
          {auth.user?.role === "Instructor"
            ? "My Created Courses"
            : "My Learning"}
        </h1>

        {courses.length === 0 ? (
          <p>No courses found</p>
        ) : (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {courses.map((course) => {
              const completed = progressMap[course._id] || 0;
              const total = course.lessons?.length || 1;

              // 🔥 FIXED PROGRESS FORMULA
              const percent = Math.floor(((completed + 1) / total) * 100);

              return (
                <div key={course._id} className="bg-white p-5 rounded shadow">

                  <h2 className="font-semibold text-lg">
                    {course.title}
                  </h2>

                  <p className="text-sm text-gray-600 mt-2">
                    {course.description}
                  </p>

                  {/* PROGRESS */}
                  {auth.user?.role !== "Instructor" && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{percent}%</span>
                      </div>

                      <div className="w-full bg-gray-200 h-2 rounded mt-1">
                        <div
                          className="bg-indigo-600 h-2 rounded"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => navigate(`/learn/${course._id}`)}
                    className="mt-6 w-full bg-indigo-600 text-white py-2 rounded"
                  >
                    {percent > 0 ? "Resume Learning" : "Start Course"}
                  </button>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default MyCoursesPage;