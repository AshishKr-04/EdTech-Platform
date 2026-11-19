import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  LayoutDashboard, 
  PlusCircle, 
  AlertCircle, 
  Eye, 
  Edit3, 
  TrendingUp, 
  Layers, 
  X,
  CheckCircle2
} from "lucide-react";

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-zinc-400 py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
          <div className="h-10 bg-zinc-900/60 rounded-xl w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-28 bg-zinc-900/40 rounded-xl border border-zinc-800" />
            <div className="h-28 bg-zinc-900/40 rounded-xl border border-zinc-800" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-52 bg-zinc-900/40 rounded-xl border border-zinc-800" />
            <div className="h-52 bg-zinc-900/40 rounded-xl border border-zinc-800" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800/80 pb-6">
          <div className="space-y-1 text-left">
            <div className="flex items-center gap-2 text-zinc-400">
              <LayoutDashboard className="h-4 w-4 text-indigo-400" />
              <span className="text-[11px] font-medium uppercase tracking-wider">Instructor Console</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">Analytics & Course Management</h1>
          </div>

          {/* CREATE COURSE BUTTON */}
          <button
            onClick={() => navigate("/create-course")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition shadow-sm"
          >
            <PlusCircle className="h-4 w-4" />
            Create Course
          </button>
        </div>

        {/* STRIPE-STYLE KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Total Courses Card */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 text-left flex items-center justify-between">
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Published Curricula</p>
              <h2 className="text-3xl font-semibold tracking-tight text-white">{data?.totalCourses || 0}</h2>
              <div className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" /> Live in production
              </div>
            </div>
            <div className="h-11 w-11 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>

          {/* Total Students Card */}
          <div className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/50 text-left flex items-center justify-between">
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Total Enrolled Students</p>
              <h2 className="text-3xl font-semibold tracking-tight text-white">{data?.totalStudents || 0}</h2>
              <div className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" /> Active platform learners
              </div>
            </div>
            <div className="h-11 w-11 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>

        </div>

        {/* COURSE PERFORMANCE */}
        <div className="text-left space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h2 className="text-base font-semibold text-zinc-100 tracking-tight">
              Course Syllabus Performance
            </h2>
            <span className="text-xs text-zinc-400">
              {data?.courseStats?.length || 0} Active Programs
            </span>
          </div>

          {!data?.courseStats || data.courseStats.length === 0 ? (
            <div className="text-center py-16 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 max-w-md mx-auto">
              <AlertCircle className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-zinc-200">No courses published yet</h3>
              <p className="text-xs text-zinc-500 mt-1 mb-4">Start by building and publishing your first educational curriculum.</p>
              <button
                onClick={() => navigate("/create-course")}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition"
              >
                Create Course
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.courseStats.map((course) => (
                <div 
                  key={course.courseId} 
                  className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-4 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100 line-clamp-1">{course.title}</h3>
                    <div className="flex gap-4 text-xs text-zinc-400 mt-2 font-medium">
                      <span className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5 text-zinc-500" /> {course.lessons} lessons</span>
                      <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-zinc-500" /> {course.students} students</span>
                    </div>
                  </div>

                  {/* CAPACITY PROGRESS BAR */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-zinc-400 font-medium">
                      <span>Cohort Engagement</span>
                      <span className="text-zinc-200">{Math.min(course.students * 10, 100)}%</span>
                    </div>
                    <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(course.students * 10, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* ACTION BUTTONS (Clean Lucide Icons, No Emojis) */}
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-800/60">
                    <button
                      onClick={() => navigate(`/course/${course.courseId}`)}
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-300 bg-zinc-800/80 hover:bg-zinc-700/80 px-3 py-1.5 rounded-lg border border-zinc-700/50 transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-zinc-400" />
                      Preview
                    </button>
                    <button
                      onClick={() => navigate(`/edit-course/${course.courseId}`)}
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-zinc-300 bg-zinc-800/80 hover:bg-zinc-700/80 px-3 py-1.5 rounded-lg border border-zinc-700/50 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-zinc-400" />
                      Edit
                    </button>
                    <button
                      onClick={() => fetchRoster(course.courseId, course.title)}
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-lg transition shadow-sm"
                    >
                      <Users className="w-3.5 h-3.5" />
                      Roster
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ROSTER MODAL OVERLAY */}
        {selectedRoster && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
              
              {/* Modal Header */}
              <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-sm font-semibold text-zinc-100 line-clamp-1">{selectedRoster}</h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Enrolled Student Cohort & Progress Verification</p>
                </div>
                <button 
                  onClick={() => setSelectedRoster(null)}
                  className="text-zinc-400 hover:text-zinc-100 p-1 rounded-md hover:bg-zinc-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto flex-grow min-h-[250px]">
                {rosterLoading ? (
                  <div className="h-full flex flex-col justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-500 mb-2"></div>
                    <p className="text-xs text-zinc-400">Loading student roster...</p>
                  </div>
                ) : rosterStudents.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-xs text-zinc-500">No students enrolled in this syllabus yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-800 text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                          <th className="pb-3">Student Name</th>
                          <th className="pb-3">Email</th>
                          <th className="pb-3">Enrolled</th>
                          <th className="pb-3 text-right">Progress</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60">
                        {rosterStudents.map((student) => (
                          <tr key={student.id} className="text-xs text-zinc-300 hover:bg-zinc-800/30 transition">
                            <td className="py-3 font-medium text-zinc-100">{student.name}</td>
                            <td className="py-3 font-mono text-zinc-400">{student.email}</td>
                            <td className="py-3 text-zinc-500">
                              {new Date(student.enrolledAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 text-right">
                              <span className="font-mono text-xs font-medium text-emerald-400">{student.progress}%</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-zinc-800 text-right">
                <button
                  onClick={() => setSelectedRoster(null)}
                  className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium border border-zinc-700/60 transition"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
