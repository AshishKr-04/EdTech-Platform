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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "info");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5
    ${isActive(path) 
      ? "bg-blue-50 text-blue-700" 
      : "text-slate-600 hover:bg-slate-50 hover:text-blue-700"}
  `;

  // Get initials for profile fallback
  const getInitials = () => {
    if (auth.user?.name) {
      return auth.user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    return auth.user?.email?.[0]?.toUpperCase() || "?";
  };

  return (
    <nav className="sticky top-0 z-[1000] border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md transition-colors duration-300 sm:px-6 sm:py-4">
      <div className="mx-auto flex max-w-7xl min-w-0 items-center justify-between gap-3">
        {/* BRAND LOGO */}
        <Link to="/" className="group flex min-w-0 items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-200">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="truncate text-xl font-bold tracking-tight text-slate-900">
            EduMind
          </span>
        </Link>

        {/* DESKTOP NAVIGATION LINKS (hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-4">
          
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
                    <Sparkles className="h-4 w-4 text-blue-600" />
                  <span>My Learning</span>
                </Link>
              )}

              {/* Student features only */}

              {/* USER SETTINGS / PROFILE DROPDOWN */}
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-2 hover:opacity-90 transition-opacity focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-white text-sm font-semibold shadow-inner">
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
                    <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 py-2 transition-all duration-300 animate-slide-up-subtle">
                      <div className="px-4 py-2 border-b border-gray-50 mb-1 text-left">
                        <p className="text-sm font-semibold text-slate-800">{auth.user?.name || "Student"}</p>
                        <p className="text-xs text-gray-500 truncate">{auth.user?.email}</p>
                        <span className="inline-block mt-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                          {auth.user?.role}
                        </span>
                      </div>

                      <Link 
                        to="/profile" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                      >
                        <UserIcon className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>

                      <button 
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50/50 transition-colors text-left"
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
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-blue-700"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition duration-150"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE NAVIGATION FOR GUESTS OR MENU TOGGLE FOR AUTHENTICATED USERS */}
        {auth.isAuthenticated ? (
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <span className="text-xl font-bold font-sans block w-6 h-6 flex items-center justify-center">✕</span>
              ) : (
                <span className="text-xl font-bold font-sans block w-6 h-6 flex items-center justify-center">☰</span>
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 lg:hidden">
            <Link 
              to="/courses" 
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Explore
            </Link>
            <Link 
              to="/login" 
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-sm"
            >
              Login
            </Link>
          </div>
        )}
      </div>

      {/* MOBILE NAVIGATION DRAWER (visible on mobile only when open) */}
      {mobileMenuOpen && (
        <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 text-left animate-slide-up-subtle lg:hidden">
          <Link 
            to="/courses" 
            onClick={() => setMobileMenuOpen(false)}
            className={`px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${
              isActive("/courses") ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Explore Courses
          </Link>

          {auth.isAuthenticated ? (
            <>
              {/* Student learning link */}
              {auth.user?.role === "Student" && (
                <Link 
                  to="/my-courses" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                    isActive("/my-courses") ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  My Learning
                </Link>
              )}

              {/* Student features only */}

              {/* Divider and personal account details */}
              <div className="border-t border-slate-100 my-2 pt-2 flex flex-col gap-2">
                <div className="px-3 py-1 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-semibold">
                    {auth.user?.avatar ? (
                      <img src={auth.user.avatar} alt={auth.user.name} className="h-full w-full object-cover rounded-full" />
                    ) : getInitials()}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 leading-none">{auth.user?.name}</p>
                    <p className="text-[10px] text-slate-500 truncate leading-none mt-1">{auth.user?.email}</p>
                  </div>
                </div>

                <Link 
                  to="/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${
                    isActive("/profile") ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <UserIcon className="h-4 w-4" />
                  My Profile
                </Link>

                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50/50 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}

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
