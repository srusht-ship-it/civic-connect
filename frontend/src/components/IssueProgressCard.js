import React, { useState } from 'react';
import './IssueProgressCard.css';

const IssueProgressCard = ({ issue, onViewDetails }) => {
  const [expanded, setExpanded] = useState(false);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '⏳';
      case 'in-progress': return '🔄';
      case 'resolved': return '✅';
      case 'rejected': return '❌';
      default: return '📝';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#f59e0b';
      case 'in-progress': return '#3b82f6';
      case 'resolved': return '#10b981';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDepartmentInfo = (department) => {
    const departments = {
      'public-works': { name: 'Public Works', icon: '🔧' },
      'transportation': { name: 'Transportation', icon: '🚗' },
      'sanitation': { name: 'Sanitation', icon: '🗑️' },
      'water-supply': { name: 'Water Supply', icon: '💧' },
      'electricity': { name: 'Electricity', icon: '⚡' },
      'housing': { name: 'Housing', icon: '🏠' },
      'health': { name: 'Health', icon: '🏥' },
      'education': { name: 'Education', icon: '🎓' },
      'parks': { name: 'Parks & Recreation', icon: '🌳' },
      'security': { name: 'Security', icon: '🛡️' }
    };
    return departments[department?.toLowerCase()] || { name: department, icon: '📋' };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressPercentage = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 25;
      case 'in-progress': return 75;
      case 'resolved': return 100;
      case 'rejected': return 100;
      default: return 0;
    }
  };

  const departmentInfo = getDepartmentInfo(issue.department);
  const progress = getProgressPercentage(issue.status);

  return (
    <div className="issue-progress-card">
      <div className="progress-card-header" onClick={() => setExpanded(!expanded)}>
        <div className="issue-summary">
          <div className="issue-icon-title">
            <span className="status-icon">{getStatusIcon(issue.status)}</span>
            <div className="issue-info">
              <h4 className="issue-title">{issue.title}</h4>
              <div className="issue-meta">
                <span className="issue-id">#{(issue._id || issue.id).toString().slice(-6)}</span>
                <span className="issue-category">{issue.category}</span>
                <span className="issue-location">📍 {issue.location}</span>
              </div>
            </div>
          </div>
          <div className="status-indicator">
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(issue.status) }}
            >
              {issue.status || 'Pending'}
            </span>
            <button className="expand-btn">
              {expanded ? '▲' : '▼'}
            </button>
          </div>
        </div>
        
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${progress}%`,
                backgroundColor: getStatusColor(issue.status)
              }}
            ></div>
          </div>
          <span className="progress-text">{progress}%</span>
        </div>
      </div>

      {expanded && (
        <div className="progress-card-details">
          <div className="timeline">
            <div className="timeline-item completed">
              <div className="timeline-icon">📝</div>
              <div className="timeline-content">
                <h5>Issue Reported</h5>
                <p>Issue submitted by citizen</p>
                <span className="timeline-date">{formatDate(issue.createdAt || issue.submittedAt)}</span>
              </div>
            </div>

            {issue.status !== 'pending' && (
              <div className="timeline-item completed">
                <div className="timeline-icon">👀</div>
                <div className="timeline-content">
                  <h5>Under Review</h5>
                  <p>Issue reviewed by admin team</p>
                  <span className="timeline-date">{formatDate(issue.updatedAt)}</span>
                </div>
              </div>
            )}

            {issue.department && (
              <div className="timeline-item completed">
                <div className="timeline-icon">{departmentInfo.icon}</div>
                <div className="timeline-content">
                  <h5>Assigned to Department</h5>
                  <p>Assigned to {departmentInfo.name}</p>
                  <span className="timeline-date">{formatDate(issue.updatedAt)}</span>
                </div>
              </div>
            )}

            {issue.status === 'in-progress' && (
              <div className="timeline-item active">
                <div className="timeline-icon">🔄</div>
                <div className="timeline-content">
                  <h5>Work in Progress</h5>
                  <p>Department is actively working on this issue</p>
                  <span className="timeline-date">In Progress</span>
                </div>
              </div>
            )}

            {issue.status === 'resolved' && (
              <div className="timeline-item completed">
                <div className="timeline-icon">✅</div>
                <div className="timeline-content">
                  <h5>Issue Resolved</h5>
                  <p>Issue has been successfully resolved</p>
                  <span className="timeline-date">{formatDate(issue.resolvedAt || issue.updatedAt)}</span>
                </div>
              </div>
            )}

            {issue.status === 'rejected' && (
              <div className="timeline-item rejected">
                <div className="timeline-icon">❌</div>
                <div className="timeline-content">
                  <h5>Issue Rejected</h5>
                  <p>Issue could not be addressed</p>
                  <span className="timeline-date">{formatDate(issue.updatedAt)}</span>
                </div>
              </div>
            )}
          </div>

          {issue.adminNotes && (
            <div className="admin-notes">
              <h5>Admin Notes</h5>
              <p>{issue.adminNotes}</p>
            </div>
          )}

          <div className="card-actions">
            <button 
              className="view-details-btn"
              onClick={() => onViewDetails && onViewDetails(issue)}
            >
              View Full Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IssueProgressCard;