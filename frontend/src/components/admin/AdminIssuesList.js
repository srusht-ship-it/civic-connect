import React from 'react';
import './AdminIssuesList.css';

const AdminIssuesList = ({ issues = [], onAssign, onStatusChange }) => {
  const getPriorityClass = (priority) => {
    return priority ? priority.toLowerCase() : 'medium';
  };

  const getStatusClass = (status) => {
    return status ? status.toLowerCase().replace(' ', '-') : 'pending';
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than 1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const handleAssign = (issueId) => {
    // In a real app, this would open a modal to select assignee
    onAssign && onAssign(issueId, 'admin-user-1');
  };

  const handleStatusChange = (issueId, currentStatus) => {
    // Cycle through statuses based on backend enum values
    const statusCycle = ['pending', 'in-progress', 'resolved', 'rejected'];
    const currentIndex = statusCycle.indexOf(currentStatus);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
    onStatusChange && onStatusChange(issueId, nextStatus);
  };

  return (
    <div className="admin-issues-list">
      <div className="issues-header">
        <h3>Reported Issues</h3>
        <div className="issues-subtitle">
          Latest submissions from citizens
        </div>
      </div>
      
      <div className="issues-container">
        {issues.map(issue => (
          <div key={issue._id || issue.id} className="issue-item">
            <div className="issue-main">
              <div className="issue-id">#{(issue._id || issue.id).toString().slice(-6)}</div>
              <div className="issue-content">
                <h4 className="issue-title">{issue.title}</h4>
                <div className="issue-meta">
                  <span className="issue-location">📍 {issue.location}</span>
                  <span className="issue-time">🕒 {formatTimeAgo(issue.createdAt || issue.submittedAt)}</span>
                  {issue.reportedBy && (
                    <span className="issue-reporter">👤 {issue.reportedBy.fullName || 'Anonymous'}</span>
                  )}
                </div>
                {issue.description && (
                  <p className="issue-description">{issue.description.substring(0, 100)}...</p>
                )}
              </div>
              <div className="issue-badges">
                <span className={`status-badge ${getStatusClass(issue.status)}`}>
                  {issue.status}
                </span>
                <span className={`priority-badge ${getPriorityClass(issue.priority)}`}>
                  {issue.priority}
                </span>
                <span className="category-badge">
                  {issue.category}
                </span>
              </div>
            </div>
            
            <div className="issue-actions">
              {issue.status === 'pending' || issue.status === 'Open' ? (
                <button 
                  onClick={() => handleAssign(issue._id || issue.id)}
                  className="assign-btn"
                >
                  Assign
                </button>
              ) : (
                <button 
                  onClick={() => handleStatusChange(issue._id || issue.id, issue.status)}
                  className="status-btn"
                >
                  Update Status
                </button>
              )}
              <button className="view-btn">
                View Details
              </button>
            </div>
          </div>
        ))}
        
        {issues.length === 0 && (
          <div className="no-issues">
            <div className="no-issues-icon">📝</div>
            <h4>No issues found</h4>
            <p>No civic issues match your current filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminIssuesList;