// API utility functions for issue management
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('auth_token'); // Changed from 'token' to 'auth_token'
};

// Create headers with authentication
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Issue API functions
export const issueAPI = {
  // Create a new issue
  createIssue: async (issueData) => {
    try {
      const token = getAuthToken();
      console.log('Auth token available:', !!token); // Debug log
      console.log('API endpoint:', `${API_BASE_URL}/issues`); // Debug log
      console.log('Issue data being sent:', issueData); // Debug log
      
      const response = await fetch(`${API_BASE_URL}/issues`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(issueData)
      });

      console.log('Response status:', response.status); // Debug log
      console.log('Response ok:', response.ok); // Debug log

      const data = await response.json();
      console.log('Response data:', data); // Debug log

      if (!response.ok) {
        console.error('API Error:', response.status, data); // Debug log
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating issue:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to server. Please check if the backend server is running.');
      }
      throw error;
    }
  },

  // Get user's own issues
  getUserIssues: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}/issues/my-issues${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user issues');
      }

      return data;
    } catch (error) {
      console.error('Error fetching user issues:', error);
      throw error;
    }
  },

  // Get all issues (admin only)
  getAllIssues: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = `${API_BASE_URL}/issues${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch issues');
      }

      return data;
    } catch (error) {
      console.error('Error fetching all issues:', error);
      throw error;
    }
  },

  // Get single issue by ID
  getIssueById: async (issueId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/${issueId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch issue');
      }

      return data;
    } catch (error) {
      console.error('Error fetching issue:', error);
      throw error;
    }
  },

  // Update issue status (admin only)
  updateIssueStatus: async (issueId, updateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/${issueId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update issue');
      }

      return data;
    } catch (error) {
      console.error('Error updating issue:', error);
      throw error;
    }
  },

  // Delete issue (admin only)
  deleteIssue: async (issueId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/${issueId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete issue');
      }

      return data;
    } catch (error) {
      console.error('Error deleting issue:', error);
      throw error;
    }
  },

  // Get issue statistics (admin only)
  getIssueStatistics: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/admin/statistics`, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch statistics');
      }

      return data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  // Assign issue to department (admin only)
  assignIssueToDepartment: async (issueId, department) => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/${issueId}/assign`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ department })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to assign issue');
      }

      return data;
    } catch (error) {
      console.error('Error assigning issue:', error);
      throw error;
    }
  }
};

export default issueAPI;