import React from 'react';
import './StatusSidebar.css';

const StatusSidebar = ({ userReports }) => {
  const handleViewAllReports = () => {
    console.log('Navigate to all reports');
  };

  const handleReportNewIssue = () => {
    console.log('Navigate to report form');
  };

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
              {userReports.inProgress}
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
          View all my reports
        </button>
      </div>

      {/* Report New Issue Button */}
      <button className="report-new-btn" onClick={handleReportNewIssue}>
        Report New Issue
      </button>
    </div>
  );
};

export default StatusSidebar;