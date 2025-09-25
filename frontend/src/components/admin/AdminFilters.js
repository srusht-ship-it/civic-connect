import React from 'react';
import './AdminFilters.css';

const AdminFilters = ({ filters, onFilterChange }) => {
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'parks', label: 'Parks & Recreation' },
    { value: 'safety', label: 'Safety' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'sanitation', label: 'Sanitation' },
    { value: 'transportation', label: 'Transportation' }
  ];

  const statuses = [
    { value: '', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in-review', label: 'In Review' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  const priorities = [
    { value: '', label: 'All Priorities' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const clearFilters = () => {
    onFilterChange('category', '');
    onFilterChange('status', '');
    onFilterChange('priority', '');
  };

  return (
    <div className="admin-filters">
      <div className="filters-header">
        <h3>Filters</h3>
        {(filters.category || filters.status || filters.priority) && (
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear
          </button>
        )}
      </div>
      
      <div className="filters-grid">
        <div className="filter-group">
          <label>Category</label>
          <select 
            value={filters.category} 
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="filter-select"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Status</label>
          <select 
            value={filters.status} 
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="filter-select"
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Priority</label>
          <select 
            value={filters.priority} 
            onChange={(e) => onFilterChange('priority', e.target.value)}
            className="filter-select"
          >
            {priorities.map(priority => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdminFilters;