import React from 'react';
import './LoadingComponent.css';

const LoadingComponent = () => {
  return (
    <div className="loading-container">
      <div className="loading-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      <span className="loading-text">Loading...</span>
    </div>
  );
};

export default LoadingComponent;