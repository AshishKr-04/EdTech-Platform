import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { auth } = useContext(AuthContext);

  // If the context is still loading, you can show a loading spinner
  if (auth.loading) {
    return <div>Loading...</div>;
  }

  // If the user is authenticated, render the child component (the page).
  // Otherwise, redirect them to the login page.
  return auth.isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;