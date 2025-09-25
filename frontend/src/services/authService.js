import API from './api';

// Authentication Service
export const authService = {
  // User Registration
  register: async (userData) => {
    try {
      const response = await API.post('/auth/register', {
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        mobileNumber: userData.phoneNumber, // Send as mobileNumber to match backend
        role: userData.role // Add the role field
      });

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user_data', JSON.stringify(response.data.data.user));
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      }
      return {
        success: false,
        message: response.data.message || 'Registration failed'
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
        errors: error.response?.data?.errors || []
      };
    }
  },

  // User Login
  login: async (credentials) => {
    try {
      const response = await API.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user_data', JSON.stringify(response.data.data.user));
        return {
          success: true,
          data: response.data.data,
          message: response.data.message
        };
      }
      return {
        success: false,
        message: response.data.message || 'Login failed'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please try again.',
        errors: error.response?.data?.errors || []
      };
    }
  },

  // User Logout
  logout: async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  },

  // Get Current User Profile
  getCurrentUser: async () => {
    try {
      const response = await API.get('/auth/profile');
      if (response.data.success) {
        return {
          success: true,
          data: response.data.data.user
        };
      }
      return {
        success: false,
        message: response.data.message || 'Failed to fetch user profile'
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user profile'
      };
    }
  },

  // Verify Token
  verifyToken: async () => {
    try {
      const response = await API.get('/auth/verify-token');
      return response.data.success;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    return !!(token && userData);
  },

  // Get stored user data
  getUserData: () => {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  // Get stored token
  getToken: () => {
    return localStorage.getItem('auth_token');
  }
};

export default authService;