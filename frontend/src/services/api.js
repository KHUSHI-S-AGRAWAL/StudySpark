import axios from 'axios';

const API = axios.create({
  // 🚀 RELATIVE API CONFIGURATION:
  // Leaving this empty lets the application automatically default to whatever domain name
  // it is deployed on. No more absolute port switches!
  baseURL: '', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;