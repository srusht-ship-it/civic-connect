import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from './context/LanguageContext';
import IssueCard from './components/IssueCard';
import StatusSidebar from './components/StatusSidebar';
import MapComponent from './components/MapComponent';
import LanguageSelector from './components/LanguageSelector';
import civicIssuesService from './services/civicIssuesService';
import './NewDashboard.css';

const NewDashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [issues, setIssues] = useState([]);
  const [userReports, setUserReports] = useState({
    pending: 0,
    inProgress: 0,
    resolved: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Load issues and user reports concurrently
      const [issuesResponse, userReportsResponse] = await Promise.all([
        civicIssuesService.getAllIssues(),
        civicIssuesService.getUserReports()
      ]);

      if (issuesResponse.success) {
        setIssues(issuesResponse.data);
      } else {
        setIssues(issuesResponse.data || []);
      }

      setUserReports(userReportsResponse);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
      
      // Load sample data as fallback
      const fallbackData = civicIssuesService.getSampleIssues();
      setIssues(fallbackData.data);
      setUserReports({
        pending: 4,
        inProgress: 3,
        resolved: 6
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const handleReportIssue = () => {
    // Navigate to report issue form
    navigate('/report-issue');
  };

  const handleIssueUpdate = (updatedIssue) => {
    setIssues(prevIssues => 
      prevIssues.map(issue => 
        issue.id === updatedIssue.id ? updatedIssue : issue
      )
    );
  };

  if (loading) {
    return (
      <div className="new-dashboard loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && issues.length === 0) {
    return (
      <div className="new-dashboard error">
        <div className="error-message">
          <h2>Unable to load dashboard</h2>
          <p>{error}</p>
          <button onClick={loadDashboardData} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="new-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon"></div>
            <span className="logo-text">Civic Connect</span>
          </div>
          
          <nav className="main-navigation">
            <button className="nav-link active">Dashboard</button>
            <button className="nav-link">All Issues</button>
            <button className="nav-link">My Reports</button>
            <button className="nav-link">Analytics</button>
          </nav>
        </div>
        
        <div className="header-center">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="Search issues, locations, categories..." 
              className="search-input"
            />
            <button className="search-btn">🔍</button>
          </div>
        </div>
        
        <div className="header-right">
          <LanguageSelector />
          <button className="header-btn notifications">
            <span className="icon">🔔</span>
            {t('notifications')}
            <span className="badge">3</span>
          </button>
          <button className="header-btn">
            <span className="icon">🗺️</span>
            Map View
          </button>
          <div className="user-menu">
            <button className="user-avatar">
              <span>JD</span>
            </button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Left Sidebar - Additional Navigation */}
        <div className="left-sidebar">
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <button className="quick-action-btn primary" onClick={handleReportIssue}>
              <span className="icon">📝</span>
              {t('reportNewIssue')}
            </button>
            <button className="quick-action-btn">
              <span className="icon">📊</span>
              {t('viewAnalytics')}
            </button>
            <button className="quick-action-btn">
              <span className="icon">👥</span>
              {t('communityForum')}
            </button>
          </div>
          
          <div className="categories-section">
            <h3>{t('issueCategories')}</h3>
            <div className="category-filters">
              <button className="category-btn active">All Issues</button>
              <button className="category-btn">Infrastructure</button>
              <button className="category-btn">Parks & Recreation</button>
              <button className="category-btn">Safety</button>
              <button className="category-btn">Utilities</button>
              <button className="category-btn">Transportation</button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <div className="welcome-content">
              <h1>Welcome back, John</h1>
              <p>See community updates and report issues to improve your neighborhood. Together, we're building a better community.</p>
            </div>
            <div className="welcome-stats">
              <div className="stat-item">
                <div className="stat-number">247</div>
                <div className="stat-label">Issues Resolved</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">52</div>
                <div className="stat-label">Active Reports</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1.2K</div>
                <div className="stat-label">Community Members</div>
              </div>
            </div>
          </div>

          {/* Trending Issues */}
          <div className="trending-section">
            <div className="section-header">
              <h2>Trending Civic Issues</h2>
              <div className="header-actions">
                <select className="sort-select">
                  <option>Sort by Recent</option>
                  <option>Sort by Popular</option>
                  <option>Sort by Status</option>
                </select>
                <button className="view-all-btn">View All Issues</button>
              </div>
            </div>
            
            <div className="issues-list">
              {issues.map(issue => (
                <IssueCard 
                  key={issue.id} 
                  issue={issue} 
                  onUpdate={handleIssueUpdate}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="right-sidebar">
          <StatusSidebar userReports={userReports} />
          <MapComponent />
          
          {/* Recent Activity */}
          <div className="activity-section">
            <h3>Recent Activity</h3>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">✅</div>
                <div className="activity-content">
                  <p>Pothole on Oak Street was resolved</p>
                  <span className="activity-time">2 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">👍</div>
                <div className="activity-content">
                  <p>Sarah liked your report about park lighting</p>
                  <span className="activity-time">5 hours ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">📝</div>
                <div className="activity-content">
                  <p>New streetlight issue reported on Pine Ave</p>
                  <span className="activity-time">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewDashboard;