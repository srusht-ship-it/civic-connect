import React, { useState } from 'react';
import './AdminTeam.css';

const AdminTeam = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'roads', name: 'Roads & Infrastructure' },
    { id: 'water', name: 'Water Supply' },
    { id: 'sanitation', name: 'Sanitation' },
    { id: 'electricity', name: 'Electricity' },
    { id: 'environment', name: 'Environment' },
    { id: 'health', name: 'Public Health' }
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      role: 'Senior Inspector',
      department: 'roads',
      status: 'online',
      activeIssues: 12,
      resolvedToday: 3,
      avgResponseTime: '2.3h',
      phone: '+91 9876543210',
      email: 'rajesh.kumar@civic.gov.in',
      joinedDate: '2019-03-15',
      profileImage: null
    },
    {
      id: 2,
      name: 'Priya Sharma',
      role: 'Water Inspector',
      department: 'water',
      status: 'online',
      activeIssues: 8,
      resolvedToday: 5,
      avgResponseTime: '1.8h',
      phone: '+91 9876543211',
      email: 'priya.sharma@civic.gov.in',
      joinedDate: '2020-07-22',
      profileImage: null
    },
    {
      id: 3,
      name: 'Amit Singh',
      role: 'Health Officer',
      department: 'health',
      status: 'away',
      activeIssues: 6,
      resolvedToday: 2,
      avgResponseTime: '3.1h',
      phone: '+91 9876543212',
      email: 'amit.singh@civic.gov.in',
      joinedDate: '2018-11-10',
      profileImage: null
    },
    {
      id: 4,
      name: 'Sunita Patel',
      role: 'Sanitation Supervisor',
      department: 'sanitation',
      status: 'offline',
      activeIssues: 15,
      resolvedToday: 0,
      avgResponseTime: '4.2h',
      phone: '+91 9876543213',
      email: 'sunita.patel@civic.gov.in',
      joinedDate: '2021-01-18',
      profileImage: null
    },
    {
      id: 5,
      name: 'Vikram Reddy',
      role: 'Electrical Engineer',
      department: 'electricity',
      status: 'online',
      activeIssues: 9,
      resolvedToday: 4,
      avgResponseTime: '2.7h',
      phone: '+91 9876543214',
      email: 'vikram.reddy@civic.gov.in',
      joinedDate: '2019-09-05',
      profileImage: null
    },
    {
      id: 6,
      name: 'Meera Gupta',
      role: 'Environment Officer',
      department: 'environment',
      status: 'online',
      activeIssues: 4,
      resolvedToday: 1,
      avgResponseTime: '1.5h',
      phone: '+91 9876543215',
      email: 'meera.gupta@civic.gov.in',
      joinedDate: '2022-04-12',
      profileImage: null
    }
  ];

  const filteredMembers = selectedDepartment === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.department === selectedDepartment);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#10b981';
      case 'away': return '#f59e0b';
      case 'offline': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="admin-team">
      <div className="team-header">
        <h3>Team Management</h3>
        <div className="team-filters">
          <select 
            value={selectedDepartment} 
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="department-filter"
          >
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="team-stats">
        <div className="stat-card">
          <div className="stat-value">{teamMembers.filter(m => m.status === 'online').length}</div>
          <div className="stat-label">Online Now</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{teamMembers.reduce((sum, m) => sum + m.activeIssues, 0)}</div>
          <div className="stat-label">Active Issues</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{teamMembers.reduce((sum, m) => sum + m.resolvedToday, 0)}</div>
          <div className="stat-label">Resolved Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">2.4h</div>
          <div className="stat-label">Avg Response</div>
        </div>
      </div>

      <div className="team-members">
        {filteredMembers.map(member => (
          <div key={member.id} className="member-card">
            <div className="member-avatar">
              {member.profileImage ? (
                <img src={member.profileImage} alt={member.name} />
              ) : (
                <div className="avatar-placeholder">
                  {getInitials(member.name)}
                </div>
              )}
              <div 
                className="status-indicator" 
                style={{ backgroundColor: getStatusColor(member.status) }}
              ></div>
            </div>

            <div className="member-info">
              <div className="member-header">
                <h4>{member.name}</h4>
                <span className="member-status" style={{ color: getStatusColor(member.status) }}>
                  {getStatusText(member.status)}
                </span>
              </div>
              
              <div className="member-role">{member.role}</div>
              <div className="member-department">
                {departments.find(d => d.id === member.department)?.name}
              </div>

              <div className="member-stats">
                <div className="stat-item">
                  <span className="stat-number">{member.activeIssues}</span>
                  <span className="stat-text">Active</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{member.resolvedToday}</span>
                  <span className="stat-text">Resolved</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{member.avgResponseTime}</span>
                  <span className="stat-text">Avg Time</span>
                </div>
              </div>

              <div className="member-contact">
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span className="contact-text">{member.phone}</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  <span className="contact-text">{member.email}</span>
                </div>
              </div>

              <div className="member-actions">
                <button className="action-btn primary">
                  Assign Issue
                </button>
                <button className="action-btn secondary">
                  View Profile
                </button>
                <button className="action-btn secondary">
                  Message
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="no-members">
          <p>No team members found for the selected department.</p>
        </div>
      )}
    </div>
  );
};

export default AdminTeam;