import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000', // Your FastAPI backend server address
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;