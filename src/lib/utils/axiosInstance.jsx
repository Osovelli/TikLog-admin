import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://testpatience.onrender.com/api/v1', // Replace with your API URL
  //timeout: 1000,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;