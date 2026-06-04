import axios from 'axios';

const API = axios.create({
  // 🚀 Paste your actual live Render backend URL here!
  baseURL: 'https://studyspark-kl5a.onrender.com', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;