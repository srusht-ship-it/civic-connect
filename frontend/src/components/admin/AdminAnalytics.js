import React from 'react';
import './AdminAnalytics.css';

const AdminAnalytics = ({ analytics = {} }) => {
  // Default analytics data
  const defaultAnalytics = {
    reportsToday: 128,
    resolvedIssues: 76,
    avgResponseTime: '1.8h',
    hotspots: [
      { name: 'Downtown Area', reports: 24, change: '+12%' },
      { name: 'Park District', reports: 18, change: '+8%' },
      { name: 'Industrial Zone', reports: 15, change: '-3%' },
      { name: 'Residential Area', reports: 12, change: '+5%' }
    ],
    quickStats: {
      activeIssues: 45,
      responseRate: '94%',
      avgResolutionTime: '2.4h',
      teamEfficiency: '87%'
    }
  };

  // Merge provided analytics with defaults
  const analyticsData = { ...defaultAnalytics, ...analytics };

  const formatChange = (change) => {
    const isPositive = change.startsWith('+');
    return {
      value: change,
      isPositive,
      class: isPositive ? 'positive' : 'negative'
    };
  };

  return (
    <div className="admin-analytics">
      <div className="analytics-header">
        <h3>Analytics</h3>
      </div>
      
      <div className="analytics-content">
        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="metric-item">
            <div className="metric-value">{analyticsData.reportsToday}</div>
            <div className="metric-label">Reports Today</div>
          </div>
          
          <div className="metric-item">
            <div className="metric-value">{analyticsData.resolvedIssues}</div>
            <div className="metric-label">Resolved Issues</div>
          </div>
          
          <div className="metric-item">
            <div className="metric-value">{analyticsData.avgResponseTime}</div>
            <div className="metric-label">Avg Response Time</div>
          </div>
        </div>
        
        {/* Hotspots */}
        <div className="hotspots-section">
          <h4>Hotspots</h4>
          <div className="hotspots-list">
            {analyticsData.hotspots.map((hotspot, index) => {
              const change = formatChange(hotspot.change);
              return (
                <div key={index} className="hotspot-item">
                  <div className="hotspot-info">
                    <div className="hotspot-rank">{index + 1}</div>
                    <div className="hotspot-details">
                      <div className="hotspot-name">{hotspot.name}</div>
                      <div className="hotspot-reports">{hotspot.reports} reports today</div>
                    </div>
                  </div>
                  <div className={`hotspot-change ${change.class}`}>
                    {change.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-row">
            <span className="stat-label">Active Issues</span>
            <span className="stat-value">{analyticsData.quickStats.activeIssues}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Response Rate</span>
            <span className="stat-value">{analyticsData.quickStats.responseRate}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Avg Resolution Time</span>
            <span className="stat-value">{analyticsData.quickStats.avgResolutionTime}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Team Efficiency</span>
            <span className="stat-value">{analyticsData.quickStats.teamEfficiency}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;