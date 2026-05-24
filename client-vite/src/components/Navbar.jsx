import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { 
  BookOpen, 
  User as UserIcon, 
  LogOut, 
  PlusCircle, 
  LayoutDashboard, 
  GraduationCap,
  Sparkles,
  ChevronDown
} from "lucide-react";

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "info");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5
    ${isActive(path) 
      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400" 
      : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:bg-gray-900/50"}
  `;

  // Get initials for profile fallback
  const getInitials = () => {
    if (auth.user?.name) {
      return auth.user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    return auth.user?.email?.[0]?.toUpperCase() || "?";
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-950/80 border-b border-gray-100 dark:border-gray-900/80 backdrop-blur-md sticky top-0 z-[1000] px-6 py-4 flex justify-between items-center transition-colors duration-300">
      
      {/* BRAND LOGO */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100 dark:shadow-none group-hover:scale-105 transition-transform duration-200">
          <GraduationCap className="h-6 w-6 animate-pulse" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
          EduMind
        </span>
      </Link>

      {/* NAVIGATION LINKS */}
      <div className="flex items-center gap-4">
        
        {/* PUBLIC */}
        <Link to="/courses" className={linkClass("/courses")}>
          <BookOpen className="h-4 w-4" />
          <span>Explore</span>
        </Link>

        {auth.isAuthenticated ? (
          <>
            {/* 🎓 STUDENT NAVIGATION */}
            {auth.user?.role === "Student" && (
              <Link to="/my-courses" className={linkClass("/my-courses")}>
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <span>My Learning</span>
              </Link>
            )}

            {/* 👨‍🏫 INSTRUCTOR NAVIGATION */}
            {auth.user?.role === "Instructor" && (
              <div className="flex items-center gap-2 border-r border-gray-100 dark:border-gray-800 pr-2">
                <Link to="/my-courses" className={linkClass("/my-courses")}>
                  <span>My Courses</span>
                </Link>
                <Link to="/instructor-dashboard" className={linkClass("/instructor-dashboard")}>
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/create-course" className={linkClass("/create-course")}>
                  <PlusCircle className="h-4 w-4" />
                  <span>New Course</span>
                </Link>
              </div>
            )}

            {/* USER SETTINGS / PROFILE DROPDOWN */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-2 hover:opacity-90 transition-opacity focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-semibold shadow-inner">
                  {auth.user?.avatar ? (
                    <img 
                      src={auth.user.avatar} 
                      alt={auth.user.name} 
                      className="h-full w-full object-cover rounded-full" 
                    />
                  ) : getInitials()}
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* DROPDOWN MENU */}
              {dropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-20 py-2 transition-all duration-300 animate-slide-up-subtle">
                    <div className="px-4 py-2 border-b border-gray-50 dark:border-gray-800 mb-1">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{auth.user?.name || "Student"}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{auth.user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full dark:bg-indigo-950/50 dark:text-indigo-400">
                        {auth.user?.role}
                      </span>
                    </div>

                    <Link 
                      to="/profile" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <UserIcon className="h-4 w-4" />
                      <span>My Profile</span>
                    </Link>

                    <button 
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2 pl-2">
            <Link 
              to="/login" 
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors dark:text-gray-300"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-100 dark:shadow-none hover:shadow-lg transition-all duration-200"
            >
              Sign Up
            </Link>
          </div>
        )}

      </div>

      <style>{`
        @keyframes slideUpSubtle {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up-subtle {
          animation: slideUpSubtle 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;