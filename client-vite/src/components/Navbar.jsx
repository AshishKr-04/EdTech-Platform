import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const authLinks = (
    <div className="flex items-center space-x-4">
      {/* Instructor Links */}
      {auth.user?.role === 'Instructor' && (
        <>
          <Link to="/my-courses" className="hover:text-gray-300">My Courses</Link>
          <Link to="/create-course" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
            Create Course
          </Link>
        </>
      )}
      {/* Student Links */}
      {auth.user?.role === 'Student' && (
        <Link to="/my-learning" className="hover:text-gray-300">My Learning</Link>
      )}
      <a href="#!" onClick={handleLogout} className="hover:underline">Logout</a>
    </div>
  );

  const guestLinks = (
    <div className="nav-links">
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  );

  return (
    <nav className="navbar bg-gray-800 text-white p-4 flex justify-between items-center mb-5">
      <div className="flex items-center space-x-8">
        <Link to="/" className="navbar-brand text-xl font-bold">EduMind</Link>
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/courses" className="hover:text-gray-300">Courses</Link>
          <Link to="/about" className="hover:text-gray-300">About</Link>
          <Link to="/contact" className="hover:text-gray-300">Contact</Link>
        </div>
      </div>
      
      {auth.isAuthenticated ? authLinks : guestLinks}
    </nav>
  );
};

export default Navbar;