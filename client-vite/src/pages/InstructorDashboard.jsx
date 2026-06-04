import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, LayoutDashboard, PlusCircle, AlertCircle } from "lucide-react";

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
        setData((prev) => prev || { totalCourses: 0, totalStudents: 0, courseStats: [] });
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="text-center py-20 animate-pulse">
        <p className="text-slate-500 font-semibold">Connecting to academic console...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2 text-slate-500">
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Instructor Console</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics Dashboard</h1>
        </div>

        {/* ➕ CREATE COURSE */}
        <button
          onClick={() => navigate("/create-course")}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Create Course
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Total Courses Card */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-left flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Courses Published</span>
            <h2 className="text-3xl font-extrabold text-slate-900">{data?.totalCourses || 0}</h2>
          </div>
          <div className="h-12 w-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

        {/* Total Students Card */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-left flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Active Enrollments</span>
            <h2 className="text-3xl font-extrabold text-slate-900">{data?.totalStudents || 0}</h2>
          </div>
          <div className="h-12 w-12 bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* COURSE PERFORMANCE */}
      <div className="text-left space-y-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight border-b border-slate-100 pb-2">
          Course Syllabus Performance
        </h2>

        {!data?.courseStats || data.courseStats.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl max-w-md mx-auto">
            <AlertCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">No courses created yet</h3>
            <p className="text-xs text-slate-500 mb-5">Start by building and publishing your first educational curriculum.</p>
            <button
              onClick={() => navigate("/create-course")}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Create Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.courseStats.map((course) => (
              <div 
                key={course.courseId} 
                className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 leading-tight line-clamp-1">{course.title}</h3>
                  <div className="flex gap-4 text-xs text-slate-500 mt-2 font-medium">
                    <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4 text-slate-400" /> {course.lessons} lessons</span>
                    <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-slate-400" /> {course.students} students</span>
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                    <span>Active Capacity</span>
                    <span>{Math.min(course.students * 10, 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-900 h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(course.students * 10, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => navigate(`/course/${course.courseId}`)}
                    className="flex-1 py-2 text-center border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition"
                  >
                    View Preview 👁️
                  </button>
                  <button
                    onClick={() => navigate(`/edit-course/${course.courseId}`)}
                    className="flex-1 py-2 text-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
                  >
                    Edit Course 📝
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;