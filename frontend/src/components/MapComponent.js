import React, { useState } from 'react';
import './MapComponent.css';

const MapComponent = () => {
  const [mapData] = useState({
    center: { lat: 40.7128, lng: -74.0060 }, // New York coordinates
    issues: [
      { id: 1, lat: 40.7589, lng: -73.9851, type: 'trash', status: 'pending' },
      { id: 2, lat: 40.7505, lng: -73.9934, type: 'pothole', status: 'in-progress' },
      { id: 3, lat: 40.7282, lng: -73.7949, type: 'streetlight', status: 'resolved' }
    ]
  });

  // Placeholder map since we don't have Google Maps API
  const generateMapPlaceholder = () => {
    return (
      <div className="map-placeholder">
        <div className="map-grid">
          {/* Grid pattern to simulate map */}
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="grid-cell"></div>
          ))}
          
          {/* Issue markers */}
          <div className="marker marker-1" title="Trash overflow - Pending">📍</div>
          <div className="marker marker-2" title="Pothole repair - In Progress">🔧</div>
          <div className="marker marker-3" title="Streetlight fixed - Resolved">✅</div>
        </div>
        
        {/* Map controls */}
        <div className="map-controls">
          <button className="map-control zoom-in">+</button>
          <button className="map-control zoom-out">-</button>
        </div>
        
        {/* Location indicator */}
        <div className="location-indicator">📍 Your Location</div>
      </div>
    );
  };

  return (
    <div className="map-component">
      <div className="map-header">
        <h3>Nearby map</h3>
        <div className="map-legend">
          <div className="legend-item">
            <div className="legend-color pending"></div>
            <span>Pending</span>
          </div>
          <div className="legend-item">
            <div className="legend-color in-progress"></div>
            <span>In Progress</span>
          </div>
          <div className="legend-item">
            <div className="legend-color resolved"></div>
            <span>Resolved</span>
          </div>
        </div>
      </div>
      
      <div className="map-container">
        {generateMapPlaceholder()}
      </div>
      
      <div className="map-footer">
        <p>See issues around your location</p>
        <button className="fullscreen-map-btn">View Full Map</button>
      </div>
    </div>
  );
};

export default MapComponent;