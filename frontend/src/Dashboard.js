import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout logic
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <svg className="dashboard-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M2 22V9L12 2L22 9V22H14V16H10V22H2Z" 
                fill="white" 
                stroke="white" 
                strokeWidth="1.5"
              />
            </svg>
            <h1>Civic Connect</h1>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome to Civic Connect!</h2>
          <p>Your gateway to local services and community updates.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏛️</div>
            <h3>Government Services</h3>
            <p>Access various government services and applications online.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📢</div>
            <h3>Community Updates</h3>
            <p>Stay informed with the latest news and announcements.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎫</div>
            <h3>Issue Reporting</h3>
            <p>Report civic issues and track their resolution status.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Community Forum</h3>
            <p>Connect and discuss with fellow community members.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;