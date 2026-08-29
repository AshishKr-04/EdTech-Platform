import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import { 
  ArrowRight, 
  ShieldAlert, 
  Users, 
  BookOpen, 
  FileCheck, 
  Activity, 
  Lock,
  TrendingUp,
  Award,
  BookOpenCheck
} from "lucide-react";

const HomePage = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.loading && auth.isAuthenticated && auth.user?.role === "Admin") {
      navigate("/admin-dashboard");
    }
  }, [auth.loading, auth.isAuthenticated, auth.user, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/users/public-stats");
        if (res.data.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch public stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 relative overflow-hidden flex flex-col justify-between">
      
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-red-650/5 bg-red-900/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 py-20 z-10 flex-grow w-full flex flex-col justify-center">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>EduMind Platform Administration</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Control the Platform. <span className="text-red-400">Secure the Core.</span>
          </h1>
          
          <p className="text-slate-450 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Superuser control center to manage database user registries, execute role promotions/demotions, moderate catalog courses, and track cryptographic credentials.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            {auth.isAuthenticated ? (
              <Link
                to="/admin-dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-6 py-3.5 text-sm font-bold text-white transition shadow-lg shadow-red-600/20"
              >
                Enter Admin Console
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-500 px-6 py-3.5 text-sm font-bold text-white transition shadow-lg shadow-red-600/20"
                >
                  Admin Secure Login
                  <Lock className="h-4 w-4" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d1222] hover:bg-slate-900 border border-slate-800 px-6 py-3.5 text-sm font-bold text-slate-200 transition"
                >
                  Create Admin Account
                </Link>
              </>
            )}
          </div>
        </div>

        {/* OPERATIONS GRID */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
          
          <div className="bg-[#0d1222]/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="h-10 w-10 bg-red-950/40 text-red-400 border border-red-900/30 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">RBAC Registries</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Audit student and teacher accounts, perform role swaps, or revoke system privileges in real-time.
            </p>
          </div>

          <div className="bg-[#0d1222]/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="h-10 w-10 bg-indigo-950/40 text-indigo-400 border border-indigo-900/30 rounded-xl flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Course Moderation</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Moderate and flag courses violating academic guidelines or delete spam curriculum structures.
            </p>
          </div>

          <div className="bg-[#0d1222]/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="h-10 w-10 bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 rounded-xl flex items-center justify-center">
              <FileCheck className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Verified Ledger</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Verify cryptographic certificate hashes and manage graduation credentials.
            </p>
          </div>

          <div className="bg-[#0d1222]/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="h-10 w-10 bg-amber-950/40 text-amber-400 border border-amber-900/30 rounded-xl flex items-center justify-center">
              <Activity className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Audit Logs</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Log platform actions, track user promotions, and manage global system security metrics.
            </p>
          </div>

        </div>

        {/* LIVE PLATFORM METRICS SUMMARY */}
        <div className="mt-20 border-t border-slate-800/60 pt-16 text-left space-y-8">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-400" />
              Live Platform Analytics Summary
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Current database indices for courses, learners, and platform engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Numeric Counters */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#0d1222]/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Courses</span>
                {loading ? (
                  <span className="h-6 w-8 bg-slate-800 rounded animate-pulse mt-2 block" />
                ) : (
                  <h4 className="text-2xl font-black text-white mt-1">{stats?.totalCourses || 0}</h4>
                )}
              </div>
              <div className="bg-[#0d1222]/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Learners</span>
                {loading ? (
                  <span className="h-6 w-8 bg-slate-800 rounded animate-pulse mt-2 block" />
                ) : (
                  <h4 className="text-2xl font-black text-white mt-1">{stats?.totalStudents || 0}</h4>
                )}
              </div>
              <div className="bg-[#0d1222]/80 border border-slate-800 p-5 rounded-2xl flex flex-col justify-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Teachers</span>
                {loading ? (
                  <span className="h-6 w-8 bg-slate-800 rounded animate-pulse mt-2 block" />
                ) : (
                  <h4 className="text-2xl font-black text-white mt-1">{stats?.totalTeachers || 0}</h4>
                )}
              </div>
            </div>

            {/* Most Followed Course */}
            <div className="bg-[#0d1222]/80 border border-slate-800 p-5 rounded-2xl flex items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-indigo-400" />
                  Most Followed Course
                </span>
                {loading ? (
                  <div className="space-y-2">
                    <span className="h-4 w-40 bg-slate-800 rounded animate-pulse block" />
                    <span className="h-3 w-24 bg-slate-800 rounded animate-pulse block" />
                  </div>
                ) : stats?.mostFollowedCourse ? (
                  <div>
                    <h5 className="font-bold text-white text-sm line-clamp-1">{stats.mostFollowedCourse.title}</h5>
                    <p className="text-slate-400 text-xs mt-1">
                      {stats.mostFollowedCourse.studentsCount} enrolled learners
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-550 text-xs">No course enrollments tracked yet.</p>
                )}
              </div>
              <div className="h-16 w-16 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                {stats?.mostFollowedCourse?.thumbnail ? (
                  <img src={stats.mostFollowedCourse.thumbnail} alt="thumbnail" className="h-full w-full object-cover" />
                ) : (
                  <BookOpenCheck className="h-6 w-6 text-indigo-400" />
                )}
              </div>
            </div>
          </div>
        </div>

      </div>



    </div>
  );
};

export default HomePage;
