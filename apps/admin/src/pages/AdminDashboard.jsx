import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useToast } from "../context/ToastContext";
import { 
  Users, 
  BookOpen, 
  Trash2, 
  ShieldAlert, 
  UserCheck, 
  Loader2, 
  Calendar,
  Layers,
  GraduationCap
} from "lucide-react";

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("users"); // "users" | "courses"
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // id of user/course undergoing action

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const res = await api.get("/users");
      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to load users", "error");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const fetchCourses = async () => {
    setIsLoadingCourses(true);
    try {
      const res = await api.get("/courses");
      // Res can return array directly or object
      const coursesData = Array.isArray(res.data) ? res.data : res.data.courses || [];
      setCourses(coursesData);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to load courses", "error");
    } finally {
      setIsLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateRole = async (userId, targetRole) => {
    setActionLoading(userId);
    try {
      const res = await api.put(`/users/${userId}/role`, { role: targetRole });
      if (res.data.success) {
        showToast(`User role updated to ${targetRole}`, "success");
        setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: targetRole } : u));
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update role", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This cannot be undone.")) return;
    setActionLoading(userId);
    try {
      const res = await api.delete(`/users/${userId}`);
      if (res.data.success) {
        showToast("User deleted successfully", "info");
        setUsers(prev => prev.filter(u => u._id !== userId));
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete user", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete/moderate this course? This will remove all associated syllabus modules.")) return;
    setActionLoading(courseId);
    try {
      const res = await api.delete(`/courses/${courseId}`);
      if (res.data.success) {
        showToast("Course moderated and deleted successfully", "info");
        setCourses(prev => prev.filter(c => c._id !== courseId));
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete course", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const studentCount = users.filter(u => u.role === "Student").length;
  const teacherCount = users.filter(u => u.role === "Teacher").length;
  const totalLessons = courses.reduce((acc, c) => acc + (c.lessons?.length || 0), 0);

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold tracking-wide text-sm uppercase">
              <ShieldAlert className="h-4 w-4" />
              <span>Platform Administration</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mt-1">EduMind Control Center</h1>
            <p className="text-slate-400 text-sm mt-1">
              Superuser access. Oversee user roles, monitor catalog courses, and handle system moderation.
            </p>
          </div>
          
          <div className="flex bg-[#0d1222]/80 border border-slate-800 p-1 rounded-xl shadow-lg">
            <button
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeTab === "users" 
                  ? "bg-indigo-600 text-white shadow-md" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Users ({users.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("courses")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeTab === "courses" 
                  ? "bg-indigo-600 text-white shadow-md" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Courses ({courses.length})</span>
            </button>
          </div>
        </div>

        {/* GLOBAL ANALYTICS STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#0d1222]/85 border border-slate-800 p-5 rounded-2xl text-left flex items-center justify-between shadow-lg">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Learners</span>
              <h2 className="text-2xl font-extrabold text-white mt-1">{studentCount}</h2>
            </div>
            <div className="h-10 w-10 bg-indigo-950/40 text-indigo-400 border border-indigo-900/30 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-[#0d1222]/85 border border-slate-800 p-5 rounded-2xl text-left flex items-center justify-between shadow-lg">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Teachers</span>
              <h2 className="text-2xl font-extrabold text-white mt-1">{teacherCount}</h2>
            </div>
            <div className="h-10 w-10 bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-[#0d1222]/85 border border-slate-800 p-5 rounded-2xl text-left flex items-center justify-between shadow-lg">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Courses</span>
              <h2 className="text-2xl font-extrabold text-white mt-1">{courses.length}</h2>
            </div>
            <div className="h-10 w-10 bg-blue-950/40 text-blue-400 border border-blue-900/30 rounded-xl flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-[#0d1222]/85 border border-slate-800 p-5 rounded-2xl text-left flex items-center justify-between shadow-lg">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Syllabus Lessons</span>
              <h2 className="text-2xl font-extrabold text-white mt-1">{totalLessons}</h2>
            </div>
            <div className="h-10 w-10 bg-amber-950/40 text-amber-400 border border-amber-900/30 rounded-xl flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {((activeTab === "users" && isLoadingUsers) || (activeTab === "courses" && isLoadingCourses)) ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-slate-400 text-sm font-medium">Fetching directory index...</p>
          </div>
        ) : activeTab === "users" ? (
          /* ================= USERS TABLE ================= */
          <div className="bg-[#0d1222]/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="px-6 py-4 border-b border-slate-850 bg-slate-900/50 flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">Registered Users Directory</h3>
              <button 
                onClick={fetchUsers} 
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
              >
                Refresh List
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase bg-slate-900/20">
                    <th className="px-6 py-4">User Details</th>
                    <th className="px-6 py-4">Role Designation</th>
                    <th className="px-6 py-4">Signed Up</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-slate-500 text-sm">
                        No registered users found in database.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-slate-900/40 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 font-bold text-sm">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover rounded-full" />
                              ) : (
                                user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-white text-sm leading-none">{user.name}</p>
                              <p className="text-slate-400 text-xs mt-1">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                            user.role === "Admin" 
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" 
                              : user.role === "Teacher" 
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 text-xs text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {actionLoading === user._id ? (
                              <Loader2 className="h-4 w-4 text-indigo-400 animate-spin mr-2" />
                            ) : (
                              <>
                                <select
                                  value={user.role}
                                  onChange={(e) => handleUpdateRole(user._id, e.target.value)}
                                  className="bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-indigo-500 outline-none"
                                >
                                  <option value="Student">Student</option>
                                  <option value="Teacher">Teacher</option>
                                  <option value="Admin">Admin</option>
                                </select>
                                
                                <button
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition"
                                  title="Delete User"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ================= COURSES TABLE ================= */
          <div className="bg-[#0d1222]/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="px-6 py-4 border-b border-slate-850 bg-slate-900/50 flex items-center justify-between">
              <h3 className="font-bold text-lg text-white">Platform Course Catalog</h3>
              <button 
                onClick={fetchCourses} 
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
              >
                Refresh List
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase bg-slate-900/20">
                    <th className="px-6 py-4">Course Info</th>
                    <th className="px-6 py-4">Instructor</th>
                    <th className="px-6 py-4">Category & Price</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {courses.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-slate-500 text-sm">
                        No courses published on platform yet.
                      </td>
                    </tr>
                  ) : (
                    courses.map((course) => (
                      <tr key={course._id} className="hover:bg-slate-900/40 transition">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-16 rounded bg-slate-800 border border-slate-700 flex-shrink-0 overflow-hidden">
                              {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-indigo-400">
                                  <GraduationCap className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-white text-sm leading-tight">{course.title}</p>
                              <p className="text-slate-400 text-xs mt-1 truncate max-w-xs">{course.description}</p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 text-sm text-slate-350">
                          {course.instructor?.name || "Unassigned"}
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-slate-450 flex items-center gap-1">
                              <Layers className="h-3 w-3" />
                              {course.category}
                            </span>
                            <span className="text-xs font-bold text-emerald-400">
                              {course.price === 0 ? "Free" : `₹${course.price}`}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 text-right">
                          {actionLoading === course._id ? (
                            <Loader2 className="h-4 w-4 text-indigo-400 animate-spin mr-2 inline" />
                          ) : (
                            <button
                              onClick={() => handleDeleteCourse(course._id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-450 border border-rose-950 bg-rose-950/20 hover:bg-rose-500/10 hover:text-rose-400 transition"
                              title="Delete Course"
                            >
                              <div className="flex items-center gap-1">
                                <Trash2 className="h-3.5 w-3.5" />
                                <span>Delete</span>
                              </div>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
