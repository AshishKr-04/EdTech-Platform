import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'; 
import axios from 'axios';

// IMPORTANT: We use the URL exactly as it is in the .env file.
// If your .env is "https://...onrender.com/api", this is perfect.
axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.defaults.withCredentials = true;

// Debugging: This will show you the exact URL in your browser console
console.log("Axios Base URL set to:", axios.defaults.baseURL);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)