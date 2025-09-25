import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token expiration
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;

// Authentication endpoints
export const login = (userData) => API.post('/auth/login', userData);
export const signup = (userData) => API.post('/auth/signup', userData);

// Email OTP endpoints (keeping for backward compatibility)
export const sendLoginOTP = (data) => API.post('/otp/send-login-otp', data);
export const verifyLoginOTP = (data) => API.post('/otp/verify-login-otp', data);
export const resendOTP = (data) => API.post('/otp/resend', data);

// Mobile OTP endpoints
export const sendMobileLoginOTP = (data) => API.post('/mobile-otp/send-login-otp', data);
export const verifyMobileLoginOTP = (data) => API.post('/mobile-otp/verify-login-otp', data);
export const sendMobileRegistrationOTP = (data) => API.post('/mobile-otp/send-registration-otp', data);
export const verifyMobileRegistrationOTP = (data) => API.post('/mobile-otp/verify-registration-otp', data);