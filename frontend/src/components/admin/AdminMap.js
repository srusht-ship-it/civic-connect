import React, { useState } from 'react';
import './AdminMap.css';

const AdminMap = ({ issues = [] }) => {
  const [mapView, setMapView] = useState('map'); // 'map' or 'satellite'
  const [showPins, setShowPins] = useState(true);
  const [showLayers, setShowLayers] = useState(false);

  const mapControls = [
    { id: 'pins', label: 'Pins', active: showPins },
    { id: 'layers', label: 'Layers', active: showLayers },
    { id: 'radius', label: 'Radius', active: false }
  ];

  const toggleControl = (controlId) => {
    switch (controlId) {
      case 'pins':
        setShowPins(!showPins);
        break;
      case 'layers':
        setShowLayers(!showLayers);
        break;
      default:
        break;
    }
  };

  // Mock map pins based on issues
  const mapPins = issues.map(issue => ({
    id: issue.id,
    x: Math.random() * 80 + 10, // Random position for demo
    y: Math.random() * 60 + 20,
    priority: issue.priority,
    status: issue.status
  }));

  return (
    <div className="admin-map-container">
      <div className="map-header">
        <h3>City Map</h3>
        <div className="map-controls">
          {mapControls.map(control => (
            <button
              key={control.id}
              className={`map-control-btn ${control.active ? 'active' : ''}`}
              onClick={() => toggleControl(control.id)}
            >
              {control.label}
            </button>
          ))}
        </div>
      </div>
      
      <div className="map-wrapper">
        <div className="map-view">
          {/* Simulated map background */}
          <div className="map-background">
            {/* Streets */}
            <div className="street horizontal" style={{ top: '30%' }}></div>
            <div className="street horizontal" style={{ top: '60%' }}></div>
            <div className="street vertical" style={{ left: '25%' }}></div>
            <div className="street vertical" style={{ left: '55%' }}></div>
            <div className="street vertical" style={{ left: '75%' }}></div>
            
            {/* Parks/Areas */}
            <div className="park" style={{ top: '35%', left: '30%', width: '20%', height: '20%' }}>
              <span className="area-label">GATE PARK</span>
            </div>
            <div className="park" style={{ top: '15%', left: '60%', width: '15%', height: '15%' }}>
              <span className="area-label">MISSION DISTRICT</span>
            </div>
            
            {/* Neighborhoods */}
            <div className="neighborhood" style={{ top: '45%', left: '10%' }}>
              <span className="neighborhood-label">FOREST KNOLLS</span>
            </div>
            <div className="neighborhood" style={{ top: '70%', left: '40%' }}>
              <span className="neighborhood-label">THE CASTRO</span>
            </div>
            <div className="neighborhood" style={{ top: '25%', left: '80%' }}>
              <span className="neighborhood-label">NOB VALLEY</span>
            </div>
            
            {/* Issue pins */}
            {showPins && mapPins.map(pin => (
              <div
                key={pin.id}
                className={`map-pin ${pin.priority.toLowerCase()} ${pin.status.toLowerCase().replace(' ', '-')}`}
                style={{ top: `${pin.y}%`, left: `${pin.x}%` }}
                title={`Issue #${pin.id} - ${pin.priority} Priority`}
              >
                <div className="pin-dot"></div>
              </div>
            ))}
            
            {/* Key locations */}
            <div className="location-marker hospital" style={{ top: '50%', left: '45%' }}>
              <span className="location-icon">🏥</span>
              <span className="location-label">Laguna Honda Hospital</span>
            </div>
            <div className="location-marker university" style={{ top: '25%', left: '20%' }}>
              <span className="location-icon">🎓</span>
              <span className="location-label">University</span>
            </div>
          </div>
          
          {/* Map overlay info */}
          <div className="map-info">
            <div className="map-legend">
              <div className="legend-item">
                <div className="legend-pin high"></div>
                <span>High Priority</span>
              </div>
              <div className="legend-item">
                <div className="legend-pin medium"></div>
                <span>Medium Priority</span>
              </div>
              <div className="legend-item">
                <div className="legend-pin low"></div>
                <span>Low Priority</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMap;