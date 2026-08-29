import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { 
  ArrowRight, 
  ShieldAlert, 
  Users, 
  BookOpen, 
  FileCheck, 
  Activity, 
  Lock
} from "lucide-react";

const HomePage = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.loading && auth.isAuthenticated && auth.user?.role === "Admin") {
      navigate("/admin-dashboard");
    }
  }, [auth.loading, auth.isAuthenticated, auth.user, navigate]);

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

      </div>



    </div>
  );
};

export default HomePage;
