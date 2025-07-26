import axios from 'axios';

// Centralized API instance for all backend calls
const API = axios.create({
  baseURL: 'https://startraders-fullstack-wpmh.onrender.com/api',
});

export default API;
