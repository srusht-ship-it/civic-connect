import React, { useState } from 'react';
import './AssignmentModal.css';

const AssignmentModal = ({ isOpen, onClose, issue, onAssign }) => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [loading, setLoading] = useState(false);

  const departments = [
    { id: 'public-works', name: 'Public Works', icon: '🔧' },
    { id: 'transportation', name: 'Transportation', icon: '🚗' },
    { id: 'sanitation', name: 'Sanitation', icon: '🗑️' },
    { id: 'water-supply', name: 'Water Supply', icon: '💧' },
    { id: 'electricity', name: 'Electricity', icon: '⚡' },
    { id: 'housing', name: 'Housing', icon: '🏠' },
    { id: 'health', name: 'Health', icon: '🏥' },
    { id: 'education', name: 'Education', icon: '🎓' },
    { id: 'parks', name: 'Parks & Recreation', icon: '🌳' },
    { id: 'security', name: 'Security', icon: '🛡️' }
  ];

  const handleAssign = async () => {
    if (!selectedDepartment) {
      alert('Please select a department');
      return;
    }

    setLoading(true);
    try {
      await onAssign(issue._id || issue.id, selectedDepartment);
      setSelectedDepartment('');
      onClose();
    } catch (error) {
      console.error('Assignment failed:', error);
      alert('Failed to assign issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="assignment-modal-overlay" onClick={onClose}>
      <div className="assignment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Assign Issue to Department</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-content">
          <div className="issue-details">
            <h4>Issue: {issue?.title}</h4>
            <p className="issue-id">ID: #{(issue?._id || issue?.id)?.toString().slice(-6)}</p>
            <p className="issue-location">📍 {issue?.location}</p>
            <p className="issue-category">Category: {issue?.category}</p>
          </div>
          
          <div className="department-selection">
            <h4>Select Department:</h4>
            <div className="departments-grid">
              {departments.map(dept => (
                <button
                  key={dept.id}
                  className={`department-card ${selectedDepartment === dept.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDepartment(dept.id)}
                >
                  <span className="dept-icon">{dept.icon}</span>
                  <span className="dept-name">{dept.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="assign-btn" 
            onClick={handleAssign}
            disabled={!selectedDepartment || loading}
          >
            {loading ? 'Assigning...' : 'Assign Issue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;