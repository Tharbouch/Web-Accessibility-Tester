import axios, { AxiosInstance } from 'axios';

// Create an Axios instance
const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const csrfToken = document.cookie.split('=')[1];
        if (csrfToken) {
            config.headers['X-CSRF-Token'] = csrfToken;
        }
        return config;
    },
    (error) => {
        console.error(error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Customize error handling here if needed
        console.error(error.response?.data?.message || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;
