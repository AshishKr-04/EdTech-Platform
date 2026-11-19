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
    px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5
    ${isActive(path) 
      ? "bg-zinc-800/90 text-zinc-100 border border-zinc-700/60" 
      : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100"}
  `;

  // Get initials for profile fallback
  const getInitials = () => {
    if (auth.user?.name) {
      return auth.user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
    return auth.user?.email?.[0]?.toUpperCase() || "?";
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#09090b]/80 border-b border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* BRAND LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm group-hover:bg-indigo-500 transition-colors">
            E
          </div>
          <span className="font-semibold text-zinc-100 tracking-tight text-lg">EduMind</span>
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
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  <span>My Learning</span>
                </Link>
              )}

              {/* USER SETTINGS / PROFILE DROPDOWN */}
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 pl-2 hover:opacity-90 transition-opacity focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-200 text-xs font-semibold shadow-inner">
                    {auth.user?.avatar ? (
                      <img 
                        src={auth.user.avatar} 
                        alt={auth.user.name} 
                        className="h-full w-full object-cover rounded-full" 
                      />
                    ) : getInitials()}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* DROPDOWN MENU */}
                {dropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-20 py-2 transition-all duration-200 animate-slide-up-subtle">
                      <div className="px-4 py-2 border-b border-zinc-800 mb-1 text-left">
                        <p className="text-sm font-semibold text-zinc-100">{auth.user?.name || "Student"}</p>
                        <p className="text-xs text-zinc-400 truncate">{auth.user?.email}</p>
                        <span className="inline-block mt-1 rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-zinc-300 border border-zinc-700/50">
                          {auth.user?.role}
                        </span>
                      </div>

                      <Link 
                        to="/profile" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-800/60 hover:text-white"
                      >
                        <UserIcon className="h-4 w-4 text-zinc-400" />
                        <span>My Profile</span>
                      </Link>

                      <button 
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:bg-rose-950/20 transition-colors text-left"
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
            <div className="flex items-center gap-3 pl-2">
              <Link 
                to="/login" 
                className="text-zinc-400 hover:text-zinc-100 text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-white text-zinc-950 font-medium hover:bg-zinc-200 transition-colors px-4 py-2 rounded-lg text-sm shadow-sm"
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
              className="rounded-lg p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 focus:outline-none transition-colors"
            >
              {mobileMenuOpen ? (
                <span className="text-xl font-bold font-sans block w-6 h-6 flex items-center justify-center">✕</span>
              ) : (
                <span className="text-xl font-bold font-sans block w-6 h-6 flex items-center justify-center">☰</span>
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 lg:hidden">
            <Link 
              to="/courses" 
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/50 transition"
            >
              Explore
            </Link>
            <Link 
              to="/login" 
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-950 bg-white hover:bg-zinc-200 transition shadow-sm"
            >
              Login
            </Link>
          </div>
        )}
      </div>

      {/* MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="px-6 pb-4 pt-2 flex flex-col gap-2 border-t border-zinc-800/80 bg-[#09090b]/95 text-left animate-slide-up-subtle lg:hidden">
          <Link 
            to="/courses" 
            onClick={() => setMobileMenuOpen(false)}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              isActive("/courses") ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Explore Courses
          </Link>

          {auth.isAuthenticated ? (
            <>
              {auth.user?.role === "Student" && (
                <Link 
                  to="/my-courses" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                    isActive("/my-courses") ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100"
                  }`}
                >
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  My Learning
                </Link>
              )}

              <div className="border-t border-zinc-800 my-2 pt-2 flex flex-col gap-2">
                <div className="px-3 py-1 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-200 text-xs font-semibold">
                    {auth.user?.avatar ? (
                      <img src={auth.user.avatar} alt={auth.user.name} className="h-full w-full object-cover rounded-full" />
                    ) : getInitials()}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-200 leading-none">{auth.user?.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate leading-none mt-1">{auth.user?.email}</p>
                  </div>
                </div>

                <Link 
                  to="/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                    isActive("/profile") ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-100"
                  }`}
                >
                  <UserIcon className="h-4 w-4 text-zinc-400" />
                  My Profile
                </Link>

                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/20 transition-colors text-left"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 rounded-lg text-sm font-medium text-zinc-300 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700/60 transition"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 rounded-lg text-sm font-medium text-zinc-950 bg-white hover:bg-zinc-200 transition shadow-sm"
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
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up-subtle {
          animation: slideUpSubtle 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
