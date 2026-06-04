import axios from 'axios';

const API = axios.create({
  // 🚀 Relative root path! Requests will hit Vercel, and Vercel will reroute them to Python
  baseURL: '', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;