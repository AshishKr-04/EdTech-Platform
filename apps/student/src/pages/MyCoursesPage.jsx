import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { GraduationCap } from "lucide-react";

const MyCoursesPage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const { auth, loadUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // ================= FETCH =================
  useEffect(() => {
    loadUser();
  }, [loadUser]);

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

        // Fetch progress and user profile for progress calculations
        if (auth.user?.role !== "Instructor") {
          const progressData = {};

          try {
            const profileRes = await api.get("/users/profile");
            setUserProfile(profileRes.data);
          } catch (err) {
            console.error("Failed to fetch user profile in MyCoursesPage", err);
          }

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
              let percent = 0;
              let isCompleted = false;

              if (auth.user?.role !== "Instructor" && userProfile) {
                const courseLessonIds = course.lessons?.map((l) => l._id?.toString() || l.toString()) || [];
                const completedCount = userProfile.completedLessons?.filter((lId) =>
                  courseLessonIds.includes(lId.toString())
                ).length || 0;
                const totalCount = course.lessons?.length || 0;

                percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

                // Check if user has a certificate for this course or reached 100%
                const hasCertificate = userProfile.certificates?.some(
                  (c) => (c.courseId?._id?.toString() || c.courseId?.toString() || c.courseId) === course._id
                );
                isCompleted = hasCertificate || percent === 100;
              } else {
                const completed = progressMap[course._id] || 0;
                const total = course.lessons?.length || 1;
                percent = Math.floor(((completed + 1) / total) * 100);
              }

              return (
                <div 
                  key={course._id} 
                  className="group block bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg text-left flex flex-col h-full relative p-0"
                >
                  {/* Course Thumbnail */}
                  <div className="w-full h-36 bg-slate-100 relative overflow-hidden flex-shrink-0 border-b border-slate-100">
                    {course.thumbnail ? (
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="h-full w-full bg-slate-150 text-slate-400 flex items-center justify-center">
                        <GraduationCap className="h-10 w-10" />
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-grow flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      <h2 className="font-bold text-sm text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-1 leading-tight">
                        {course.title}
                      </h2>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      {/* PROGRESS */}
                      {auth.user?.role !== "Instructor" && (
                        <div className="mt-3">
                          <div className="flex justify-between text-[11px] font-semibold text-slate-600">
                            <span>Syllabus Progress</span>
                            <span>{percent}%</span>
                          </div>

                          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                            <div
                               className="bg-slate-900 h-full rounded-full transition-all duration-300"
                               style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                      {auth.user?.role === "Instructor" ? (
                        <>
                          <button
                            onClick={() => navigate(`/edit-course/${course._id}`)}
                            className="w-full bg-slate-900 text-white py-1.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition shadow-sm"
                          >
                            Edit Course 📝
                          </button>
                          <button
                            onClick={() => navigate(`/course/${course._id}`)}
                            className="w-full border border-slate-200 text-slate-700 py-1.5 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
                          >
                            View Syllabus Preview 👁️
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => navigate(`/learn/${course._id}`)}
                            className="w-full bg-slate-900 text-white py-1.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition shadow-sm"
                          >
                            {isCompleted ? "Review Course" : percent > 0 ? "Resume Learning" : "Start Course"}
                          </button>
                          {isCompleted && (
                            <button
                              onClick={() => navigate("/profile?tab=certificates")}
                              className="w-full bg-emerald-600 text-white py-1.5 rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-1 shadow-sm"
                            >
                              View Certificate 🎓
                            </button>
                          )}
                        </>
                      )}
                    </div>

                  </div>

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