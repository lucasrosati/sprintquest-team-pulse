
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',   // 👈 usa o .env ou string vazia para usar proxy
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(cfg => {
  console.log('API Request:', cfg.method?.toUpperCase(), cfg.url, cfg.data);
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    });
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login if needed
    }
    
    return Promise.reject(error);
  }
);

export default api;
