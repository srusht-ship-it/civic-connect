import React from 'react';
import './AdminHeader.css';

const AdminHeader = ({ user, onLogout, activeView, setActiveView }) => {
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'issues', label: 'Issues', icon: '📋' },
    { id: 'team', label: 'Team', icon: '👥' },
    { id: 'analytics', label: 'Analytics', icon: '📈' }
  ];

  const getUserInitials = (fullName) => {
    if (!fullName) return 'A';
    return fullName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <div className="admin-logo">
          <div className="logo-icon admin-icon"></div>
          <span className="logo-text">Civic Connect Admin</span>
        </div>
      </div>
      
      <div className="admin-header-center">
        <nav className="admin-nav">
          {navigationItems.map(item => (
            <button 
              key={item.id}
              className={`admin-nav-btn ${activeView === item.id ? 'active' : ''}`}
              onClick={() => setActiveView(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="admin-header-right">
        <button className="admin-header-btn">
          <span className="btn-text">Refresh</span>
        </button>
        <button className="admin-header-btn">
          <span className="btn-text">Export</span>
        </button>
        
        <div className="admin-user-menu">
          <div className="admin-user-info">
            <button className="admin-user-avatar" title={user?.fullName || 'Admin'}>
              <span>{getUserInitials(user?.fullName)}</span>
            </button>
            <div className="admin-user-details">
              <span className="admin-user-name">{user?.fullName || 'Admin'}</span>
              <span className="admin-user-role">Administrator</span>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={onLogout}>
            <span className="icon">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;