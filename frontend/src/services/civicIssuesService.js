// Civic Issues API Service
import api from './api';

class CivicIssuesService {
  // Fetch all civic issues
  async getAllIssues() {
    try {
      const response = await api.get('/issues');
      return response.data;
    } catch (error) {
      console.error('Error fetching issues:', error);
      // Return sample data for now
      return this.getSampleIssues();
    }
  }

  // Fetch user's reports
  async getUserReports() {
    try {
      const response = await api.get('/issues/user-reports');
      return response.data;
    } catch (error) {
      console.error('Error fetching user reports:', error);
      // Return sample data for now
      return {
        pending: 4,
        inProgress: 3,
        resolved: 6,
        total: 13
      };
    }
  }

  // Create a new issue report
  async reportIssue(issueData) {
    try {
      const response = await api.post('/issues/report', issueData);
      return response.data;
    } catch (error) {
      console.error('Error reporting issue:', error);
      throw error;
    }
  }

  // Like/Unlike an issue
  async toggleLike(issueId) {
    try {
      const response = await api.post(`/issues/${issueId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }

  // Share an issue
  async shareIssue(issueId) {
    try {
      const response = await api.post(`/issues/${issueId}/share`);
      return response.data;
    } catch (error) {
      console.error('Error sharing issue:', error);
      throw error;
    }
  }

  // Get nearby issues for map
  async getNearbyIssues(lat, lng, radius = 5000) {
    try {
      const response = await api.get('/issues/nearby', {
        params: { lat, lng, radius }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching nearby issues:', error);
      // Return sample data for now
      return [
        { id: 1, lat: 40.7589, lng: -73.9851, type: 'trash', status: 'pending' },
        { id: 2, lat: 40.7505, lng: -73.9934, type: 'pothole', status: 'in-progress' },
        { id: 3, lat: 40.7282, lng: -73.7949, type: 'streetlight', status: 'resolved' }
      ];
    }
  }

  // Get sample issues for demo/fallback
  getSampleIssues() {
    return {
      success: true,
      data: [
        {
          id: 1,
          title: "Overflowing trash bins near Elm Park",
          description: "Residents report frequent overflow on weekends. Public Works notified and scheduled for pickup.",
          author: "Greenway Group",
          category: "Parks",
          image: "https://images.unsplash.com/photo-1595059488652-c5e1d3e0b0a3?w=400&h=200&fit=crop",
          likes: 126,
          shares: 35,
          status: "In Progress",
          location: "Elm Park",
          createdAt: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          title: "Pothole repairs along Oak Street",
          description: "Repair crew scheduled tomorrow 6am-3pm. Expect potential closures and brief delays.",
          author: "Ward 5 Office",
          category: "Infrastructure",
          image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=200&fit=crop",
          likes: 78,
          shares: 9,
          status: "Scheduled",
          location: "Oak Street",
          createdAt: "2024-01-14T14:20:00Z"
        },
        {
          id: 3,
          title: "Streetlight outages reported on Pine Ave",
          description: "Multiple lights are down between 3rd and 6th. Linked concern with Utilities Dept.",
          author: "Neighborhood Watch",
          category: "Safety",
          image: "https://images.unsplash.com/photo-1518709268805-4e9042af2ac0?w=400&h=200&fit=crop",
          likes: 52,
          shares: 22,
          status: "Under Investigation",
          location: "Pine Ave",
          createdAt: "2024-01-13T20:15:00Z"
        }
      ]
    };
  }
}

export default new CivicIssuesService();