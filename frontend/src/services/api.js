import axios from 'axios';

const API = axios.create({
  // Swap this URL out with your actual Render web service link once it's created!
  baseURL: 'https://studyspark-backend.onrender.com', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;