import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { issueAPI } from '../../utils/issueAPI';
import AdminHeader from './AdminHeader';
import AdminFilters from './AdminFilters';
import AdminMap from './AdminMap';
import AdminIssuesList from './AdminIssuesList';
import AdminAnalytics from './AdminAnalytics';
import AdminTeam from './AdminTeam';
import AssignmentModal from './AssignmentModal';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeView, setActiveView] = useState('overview');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    priority: '',
    location: ''
  });
  const [issues, setIssues] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignmentModal, setAssignmentModal] = useState({
    isOpen: false,
    issue: null
  });

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Handle opening assignment modal
  const handleOpenAssignmentModal = (issue) => {
    setAssignmentModal({
      isOpen: true,
      issue: issue
    });
  };

  // Handle closing assignment modal
  const handleCloseAssignmentModal = () => {
    setAssignmentModal({
      isOpen: false,
      issue: null
    });
  };

  // Handle assigning issue to department
  const handleAssignIssue = async (issueId, department) => {
    try {
      await issueAPI.assignIssueToDepartment(issueId, department);
      // Refresh issues after assignment
      await fetchIssues();
      console.log(`Issue ${issueId} assigned to ${department}`);
    } catch (error) {
      console.error('Failed to assign issue:', error);
      throw error; // Let the modal handle the error display
    }
  };

  // Fetch issues data from API
  useEffect(() => {
    fetchIssues();
    fetchStatistics();
  }, [filters]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await issueAPI.getAllIssues(filters);
      setIssues(response.issues || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching issues:', error);
      setError(error.message);
      setIssues([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await issueAPI.getIssueStatistics();
      setStatistics(response.statistics);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleAssign = (issueId, assignedTo = null) => {
    // Find the issue by ID
    const issue = issues.find(issue => (issue._id || issue.id) === issueId);
    if (issue) {
      handleOpenAssignmentModal(issue);
    }
  };

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await issueAPI.updateIssueStatus(issueId, { status: newStatus });
      // Refresh issues after status change
      fetchIssues();
      fetchStatistics(); // Also refresh statistics
    } catch (error) {
      console.error('Error updating issue status:', error);
      alert('Failed to update issue status');
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const renderActiveView = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading issues...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="error-message">
            <h3>Error Loading Data</h3>
            <p>{error}</p>
            <button onClick={fetchIssues} className="retry-btn">
              Retry
            </button>
          </div>
        </div>
      );
    }

    switch (activeView) {
      case 'overview':
        return (
          <div className="overview-content">
            <div className="dashboard-grid">
              <div className="map-section">
                <AdminMap filters={filters} issues={issues} />
              </div>
              <div className="analytics-section">
                <AdminAnalytics statistics={statistics} />
              </div>
            </div>
            <div className="issues-section">
              <AdminIssuesList 
                filters={filters} 
                issues={issues} 
                onAssign={handleAssign}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        );
      case 'issues':
        return (
          <div className="issues-content">
            <AdminIssuesList 
              filters={filters} 
              issues={issues} 
              showFullView={true}
              onAssign={handleAssign}
              onStatusChange={handleStatusChange}
            />
          </div>
        );
      case 'team':
        return (
          <div className="team-content">
            <AdminTeam />
          </div>
        );
      case 'analytics':
        return (
          <div className="analytics-content">
            <AdminAnalytics statistics={statistics} fullView={true} />
          </div>
        );
      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminHeader 
        user={user}
        onLogout={handleLogout}
        activeView={activeView} 
        setActiveView={setActiveView} 
      />
      
      <div className="dashboard-content">
        <div className="filters-section">
          <AdminFilters 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
        </div>
        
        <div className="main-content">
          {renderActiveView()}
        </div>
      </div>
      
      <AssignmentModal
        isOpen={assignmentModal.isOpen}
        onClose={handleCloseAssignmentModal}
        issue={assignmentModal.issue}
        onAssign={handleAssignIssue}
      />
    </div>
  );
};

export default AdminDashboard;