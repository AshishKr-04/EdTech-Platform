import axios from 'axios';

// baseURL points to your Render instance + /api
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, 
});

export default api;