import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { GraduationCap, ArrowRight, BookOpen, Award } from "lucide-react";

const MyCoursesPage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const { auth, loadUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // ================= FETCH =================
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        let res;

        if (auth.user?.role === "Instructor") {
          res = await api.get("/courses/instructor/my-courses");
        } else {
          res = await api.get("/users/my-learning");
        }

        const courseList = res.data.courses || [];
        setCourses(courseList);

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
      } finally {
        setLoading(false);
      }
    };

    if (auth.user) fetchCourses();
  }, [auth.user]);

  return (
    <div className="bg-[#09090b] text-zinc-100 min-h-screen py-10 px-6">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex justify-between items-center border-b border-zinc-800/80 pb-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
              {auth.user?.role === "Instructor"
                ? "My Created Courses"
                : "My Learning"}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              {auth.user?.role === "Instructor"
                ? "Manage your published courses and curriculum content"
                : "Continue your enrolled programs and track syllabus completion"}
            </p>
          </div>
          
          <button
            onClick={() => navigate("/courses")}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-800 transition"
          >
            Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-3">
                <div className="aspect-video w-full rounded-lg bg-zinc-800" />
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
                <div className="h-2 bg-zinc-800 rounded w-full mt-4" />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 max-w-md mx-auto">
            <BookOpen className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-zinc-200">No courses enrolled yet</h3>
            <p className="text-xs text-zinc-500 mt-1 mb-5">Explore available courses to jumpstart your career.</p>
            <button
              onClick={() => navigate("/courses")}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition"
            >
              Explore Courses
            </button>
          </div>
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
                  className="group rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80 text-left flex flex-col justify-between"
                >
                  <div>
                    {/* Course Thumbnail (16:9 ratio) */}
                    <div className="aspect-video w-full rounded-lg bg-zinc-800 overflow-hidden mb-3 relative flex items-center justify-center">
                      {course.thumbnail ? (
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <GraduationCap className="w-10 h-10 text-zinc-600" />
                      )}
                      {isCompleted && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-medium rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 inline-flex items-center gap-1">
                          Completed
                        </span>
                      )}
                    </div>

                    <h3 className="font-medium text-zinc-100 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {course.description}
                    </p>

                    {/* PROGRESS */}
                    {auth.user?.role !== "Instructor" && (
                      <div className="mt-4">
                        <div className="flex justify-between text-[11px] font-medium text-zinc-400 mb-1.5">
                          <span>Syllabus Progress</span>
                          <span className="text-zinc-200">{percent}%</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-zinc-800/60 flex flex-col gap-2">
                    {auth.user?.role === "Instructor" ? (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => navigate(`/edit-course/${course._id}`)}
                          className="w-full text-center py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/50 transition"
                        >
                          Edit Course
                        </button>
                        <button
                          onClick={() => navigate(`/course/${course._id}`)}
                          className="w-full text-center py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition"
                        >
                          Preview
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => navigate(`/learn/${course._id}`)}
                          className="w-full inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white py-1.5 rounded-lg text-xs font-medium transition shadow-sm"
                        >
                          {isCompleted ? "Review Syllabus" : percent > 0 ? "Resume Learning" : "Start Course"}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        {isCompleted && (
                          <button
                            onClick={() => navigate("/profile?tab=certificates")}
                            className="w-full inline-flex items-center justify-center gap-1.5 bg-zinc-800/80 hover:bg-zinc-700/80 text-emerald-400 py-1.5 rounded-lg text-xs font-medium border border-zinc-700/50 transition"
                          >
                            <Award className="w-3.5 h-3.5" /> View Certificate
                          </button>
                        )}
                      </>
                    )}
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
