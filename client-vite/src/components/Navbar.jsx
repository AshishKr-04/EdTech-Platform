import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* LOGO */}
      <Link to="/" className="text-xl font-bold text-indigo-600">
        EduMind
      </Link>

      <div className="flex items-center gap-4">

        {/* PUBLIC */}
        <Link to="/courses">Courses</Link>

        {auth.isAuthenticated ? (
          <>
            {/* ✅ ROLE BASED LINK */}
            {auth.user?.role === "Instructor" ? (
              <Link to="/my-courses" className="font-semibold text-indigo-600">
                Dashboard
              </Link>
            ) : (
              <Link to="/my-courses" className="font-semibold text-indigo-600">
                My Courses
              </Link>
            )}

            {/* ✅ CREATE COURSE (Instructor only) */}
            {auth.user?.role === "Instructor" && (
              <Link
                to="/create-course"
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                + Create
              </Link>
            )}

            {/* USER INFO */}
            <span className="text-sm text-gray-600">
              👋 {auth.user?.email}
            </span>

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;