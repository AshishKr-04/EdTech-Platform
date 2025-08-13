import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // 👈 Import AuthContext
import './Navbar.css';

const Navbar = () => {
  const { auth, logout } = useContext(AuthContext); // 👈 Get auth state and logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  const authLinks = (
    <div className="nav-links">
      {/* You can add a dashboard link here later */}
      <a href="#!" onClick={handleLogout}>Logout</a>
    </div>
  );

  const guestLinks = (
    <div className="nav-links">
      <Link to="/login">Login</Link>
      <Link to="/register">Register</Link>
    </div>
  );

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">EdTech Platform</Link>
      {auth.isAuthenticated ? authLinks : guestLinks} {/* 👈 Conditionally render links */}
    </nav>
  );
};

export default Navbar;