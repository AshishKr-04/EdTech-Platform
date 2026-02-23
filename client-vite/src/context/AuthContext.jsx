import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

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
        // We use a relative path now because baseURL is set in main.jsx
        const res = await axios.get('/auth/me');
        setAuth({
          token: token,
          isAuthenticated: true,
          loading: false,
          user: res.data,
        });
      } catch (err) {
        localStorage.removeItem('token');
        setAuthToken(null);
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
    await loadUser();
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setAuth({ token: null, isAuthenticated: false, loading: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {/* If loading is true, we could show a spinner here */}
      {!auth.loading ? children : (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};