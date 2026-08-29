import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { 
  ArrowRight, 
  BookOpen, 
  Users, 
  LayoutDashboard, 
  PlusCircle, 
  Video, 
  TrendingUp,
  Award,
  Layers,
  GraduationCap
} from "lucide-react";

const HomePage = () => {
  const { auth } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 relative overflow-hidden flex flex-col justify-between">
      
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 py-20 z-10 flex-grow w-full flex flex-col justify-center">
        
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Instructor Workspace Console</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Share Your Knowledge. <span className="text-indigo-400">Inspire Learners.</span>
          </h1>
          
          <p className="text-slate-450 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Design dynamic curricula, upload high-definition video lectures, monitor live student progress rosters, and scale your global academic impact.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
            {auth.isAuthenticated ? (
              <>
                <Link
                  to="/instructor-dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3.5 text-sm font-bold text-white transition shadow-lg shadow-indigo-600/20"
                >
                  Enter Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/create-course"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d1222] hover:bg-slate-900 border border-slate-800 px-6 py-3.5 text-sm font-bold text-slate-200 transition"
                >
                  <PlusCircle className="h-4 w-4 text-indigo-400" />
                  Create New Course
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3.5 text-sm font-bold text-white transition shadow-lg shadow-indigo-600/20"
                >
                  Sign In to Workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d1222] hover:bg-slate-900 border border-slate-800 px-6 py-3.5 text-sm font-bold text-slate-200 transition"
                >
                  Join as Teacher
                </Link>
              </>
            )}
          </div>
        </div>

        {/* WORKSPACE TOOLS GRID */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          
          <div className="bg-[#0d1222]/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="h-10 w-10 bg-indigo-950/40 text-indigo-400 border border-indigo-900/30 rounded-xl flex items-center justify-center">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Course Builder</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Plan curriculum sections, upload curriculum documents, add lesson topics, and manage draft status.
            </p>
          </div>

          <div className="bg-[#0d1222]/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="h-10 w-10 bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Progress Rosters</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Track student list data, emails, enrollment timelines, and live progress bars for all syllabus lessons.
            </p>
          </div>

          <div className="bg-[#0d1222]/80 border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="h-10 w-10 bg-blue-950/40 text-blue-400 border border-blue-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Advanced Analytics</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Audit course ratings, enrollment patterns, student drop-off rates, and generate income statistics.
            </p>
          </div>

        </div>

      </div>



    </div>
  );
};

export default HomePage;
