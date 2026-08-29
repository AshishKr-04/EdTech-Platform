import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { BookOpen, Users, LayoutDashboard, PlusCircle, AlertCircle } from "lucide-react";

const InstructorDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [selectedRoster, setSelectedRoster] = useState(null);
  const [rosterStudents, setRosterStudents] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(false);

  const fetchRoster = async (courseId, courseTitle) => {
    setSelectedRoster(courseTitle);
    setRosterLoading(true);
    try {
      const res = await api.get(`/courses/instructor/courses/${courseId}/roster`);
      if (res.data.success) {
        setRosterStudents(res.data.roster || []);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load course student roster.");
    } finally {
      setRosterLoading(false);
    }
  };

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
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => navigate(`/course/${course.courseId}`)}
                    className="py-2 text-center border border-slate-200 text-slate-700 rounded-xl text-[11px] font-bold hover:bg-slate-50 transition"
                  >
                    Preview 👁️
                  </button>
                  <button
                    onClick={() => navigate(`/edit-course/${course.courseId}`)}
                    className="py-2 text-center bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold transition shadow-sm"
                  >
                    Edit 📝
                  </button>
                  <button
                    onClick={() => fetchRoster(course.courseId, course.title)}
                    className="py-2 text-center bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-bold transition shadow-sm"
                  >
                    Roster 👥
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ROSTER MODAL OVERLAY */}
      {selectedRoster && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{selectedRoster}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Enrolled Students & Progress Roster</p>
              </div>
              <button 
                onClick={() => setSelectedRoster(null)}
                className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-grow min-h-[300px]">
              {rosterLoading ? (
                <div className="h-full flex flex-col justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mb-2"></div>
                  <p className="text-xs text-slate-500 font-semibold">Retrieving course roster...</p>
                </div>
              ) : rosterStudents.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-sm text-slate-500 font-medium">No students enrolled in this syllabus yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          <th className="pb-3">Student Name</th>
                          <th className="pb-3">Email Address</th>
                          <th className="pb-3">Enrolled Date</th>
                          <th className="pb-3 text-right">Progress</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {rosterStudents.map((student) => (
                          <tr key={student.id} className="text-xs text-slate-750">
                            <td className="py-3.5 font-bold text-slate-900">{student.name}</td>
                            <td className="py-3.5 font-mono">{student.email}</td>
                            <td className="py-3.5 text-slate-500">
                              {new Date(student.enrolledAt).toLocaleDateString()}
                            </td>
                            <td className="py-3.5">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-20 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                                  <div 
                                    className="bg-emerald-500 h-full rounded-full"
                                    style={{ width: `${student.progress}%` }}
                                  />
                                </div>
                                <span className="font-bold text-slate-900">{student.progress}%</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 text-right">
              <button
                onClick={() => setSelectedRoster(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
              >
                Close Roster
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorDashboard;