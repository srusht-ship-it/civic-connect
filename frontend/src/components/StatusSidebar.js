import React from 'react';
import './StatusSidebar.css';

const StatusSidebar = ({ userReports, userIssues = [] }) => {
  const handleViewAllReports = () => {
    console.log('Navigate to all reports');
  };

  const handleReportNewIssue = () => {
    console.log('Navigate to report form');
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '⏳';
      case 'in-progress': return '🔄';
      case 'resolved': return '✅';
      case 'rejected': return '❌';
      default: return '📝';
    }
  };

  const getDepartmentIcon = (department) => {
    switch (department?.toLowerCase()) {
      case 'public-works': return '🔧';
      case 'transportation': return '🚗';
      case 'sanitation': return '🗑️';
      case 'water-supply': return '💧';
      case 'electricity': return '⚡';
      case 'housing': return '🏠';
      case 'health': return '🏥';
      case 'education': return '🎓';
      case 'parks': return '🌳';
      case 'security': return '🛡️';
      default: return '📋';
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than 1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  // Get recent issues (last 3)
  const recentIssues = userIssues
    .sort((a, b) => new Date(b.createdAt || b.submittedAt) - new Date(a.createdAt || a.submittedAt))
    .slice(0, 3);

  return (
    <div className="status-sidebar">
      {/* My Reports Section */}
      <div className="reports-section">
        <h3>My Reports</h3>
        
        <div className="report-status-list">
          {/* Pending */}
          <div className="status-item">
            <div className="status-info">
              <span className="status-label">Pending</span>
              <span className="status-sublabel">Awaiting review</span>
            </div>
            <div className="status-badge pending">
              {userReports.pending}
            </div>
          </div>

          {/* In Progress */}
          <div className="status-item">
            <div className="status-info">
              <span className="status-label">In Progress</span>
              <span className="status-sublabel">Being addressed</span>
            </div>
            <div className="status-badge in-progress">
              {userReports.inProgress || userReports['in-progress'] || 0}
            </div>
          </div>

          {/* Resolved */}
          <div className="status-item">
            <div className="status-info">
              <span className="status-label">Resolved</span>
              <span className="status-sublabel">Completed</span>
            </div>
            <div className="status-badge resolved">
              {userReports.resolved}
            </div>
          </div>
        </div>

        <button className="view-all-btn" onClick={handleViewAllReports}>
          View all my reports ({userReports.total || 0})
        </button>
      </div>

      {/* Recent Issues Progress */}
      {recentIssues.length > 0 && (
        <div className="recent-issues-section">
          <h3>Recent Issues Progress</h3>
          <div className="recent-issues-list">
            {recentIssues.map((issue) => (
              <div 
                key={issue._id || issue.id} 
                className="recent-issue-item"
                data-status={issue.status?.toLowerCase() || 'pending'}
              >
                <div className="issue-status-icon">
                  {getStatusIcon(issue.status)}
                </div>
                <div className="issue-details">
                  <div className="issue-title">{issue.title}</div>
                  <div className="issue-meta">
                    <span className="issue-status-text">{issue.status || 'Pending'}</span>
                    {issue.department && (
                      <span className="issue-department">
                        {getDepartmentIcon(issue.department)} 
                        {issue.department.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    )}
                  </div>
                  <div className="issue-time">{formatTimeAgo(issue.createdAt || issue.submittedAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Report New Issue Button */}
      <button className="report-new-btn" onClick={handleReportNewIssue}>
        Report New Issue
      </button>
    </div>
  );
};

export default StatusSidebar;