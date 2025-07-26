import axios from 'axios';

// Centralized API instance for all backend calls
const API = axios.create({
  baseURL: 'https://startraders-fullstack-9ayr.onrender.com/api',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  (error) => {
    const { response, request, message } = error;
    
    if (response) {
      // Server responded with error status
      console.error(`❌ API Error Response: ${response.status} - ${response.data?.message || message}`);
      
      // Handle specific error codes
      if (response.status === 401) {
        // Unauthorized - maybe redirect to login
        console.warn('🔐 Unauthorized access - redirecting to login');
        if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
          window.location.href = '/login';
        }
      } else if (response.status === 500) {
        // Server error
        console.error('🔥 Server Error:', response.data);
      }
    } else if (request) {
      // Network error
      console.error('🌐 Network Error: No response received', message);
    } else {
      // Request setup error
      console.error('⚠️ Request Setup Error:', message);
    }
    
    return Promise.reject(error);
  }
);

// API Health Check
export const checkAPIHealth = async () => {
  try {
    const response = await API.get('/ping');
    return { status: 'healthy', data: response.data };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
};

// API Status Debug
export const getAPIStatus = async () => {
  try {
    const response = await API.get('/debug/status');
    return { status: 'success', data: response.data };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
};

export default API;
