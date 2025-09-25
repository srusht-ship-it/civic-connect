// API utility functions for issue management
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get authentication token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
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
      const response = await fetch(`${API_BASE_URL}/issues`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(issueData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create issue');
      }

      return data;
    } catch (error) {
      console.error('Error creating issue:', error);
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
  }
};

export default issueAPI;