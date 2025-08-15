import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import the decoder

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null, // This will hold user info like id and role
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedUser = jwtDecode(token); // Decode the token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAuth({
          token: token,
          isAuthenticated: true,
          loading: false,
          user: decodedUser.user, // Store the user object from the token
        });
      } catch (err) {
        // Handle invalid token
        localStorage.removeItem('token');
        setAuth({ token: null, isAuthenticated: false, loading: false, user: null });
      }
    } else {
      setAuth({ token: null, isAuthenticated: false, loading: false, user: null });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    const decodedUser = jwtDecode(token); // Decode on login
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setAuth({
      token: token,
      isAuthenticated: true,
      loading: false,
      user: decodedUser.user, // Store user object on login
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setAuth({ token: null, isAuthenticated: false, loading: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {!auth.loading && children}
    </AuthContext.Provider>
  );
};