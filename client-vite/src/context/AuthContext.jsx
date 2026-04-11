import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api'; // ✅ use api instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    user: null,
  });

  // ✅ Load user (auto login)
  const loadUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setAuth({
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      });
      return;
    }

    try {
      const res = await api.get('/auth/me');

      setAuth({
        token: token,
        isAuthenticated: true,
        loading: false,
        user: res.data.user, // ✅ FIXED
      });

    } catch (err) {
      console.error(err);

      localStorage.removeItem('token');

      setAuth({
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // ✅ Login
  const login = async (token) => {
    localStorage.setItem('token', token);
    await loadUser(); // reload user
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem('token');

    setAuth({
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {auth.loading ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};