import axios from 'axios';

const API = axios.create({
  // 🚀 Paste your actual live Render backend URL here!
  baseURL: 'https://YOUR-STUDYSPARK-BACKEND.onrender.com', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;