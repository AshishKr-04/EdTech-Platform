import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
export const AuthContext = createContext();

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
  });

  // Effect to check for token in localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set the token in axios headers for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // For now, we'll just mark as authenticated. A real app would verify the token with the backend here.
      setAuth({
        token: token,
        isAuthenticated: true,
        loading: false,
        user: null, // You can fetch user data here
      });
    } else {
      setAuth({
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setAuth({
      token: token,
      isAuthenticated: true,
      loading: false,
      user: null,
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setAuth({
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {!auth.loading && children}
    </AuthContext.Provider>
  );
};