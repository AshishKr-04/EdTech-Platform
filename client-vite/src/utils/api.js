import axios from 'axios';

// This automatically picks the URL from your .env file
const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;