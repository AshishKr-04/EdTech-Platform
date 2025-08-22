import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

// A helper function to set the auth token in axios headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
  });

  const loadUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      try {
        // Get the full user profile from our new endpoint
        const res = await axios.get('http://localhost:5000/api/auth/me');
        setAuth({
          token: token,
          isAuthenticated: true,
          loading: false,
          user: res.data, // Store the full user object
        });
      } catch (err) {
        // Handle token being invalid or expired
        localStorage.removeItem('token');
        setAuth({ token: null, isAuthenticated: false, loading: false, user: null });
      }
    } else {
      setAuth({ token: null, isAuthenticated: false, loading: false, user: null });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (token) => {
    localStorage.setItem('token', token);
    await loadUser(); // Load user data right after setting the token
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setAuth({ token: null, isAuthenticated: false, loading: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {!auth.loading && children}
    </AuthContext.Provider>
  );
};