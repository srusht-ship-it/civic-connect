import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import LoadingComponent from './LoadingComponent';

function LandingPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading for 3 seconds then navigate to login
    const timer = setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="App">
      <div className="main-container">
        <div className="content-card">
          <div className="icon-container">
            <svg className="civic-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M2 22V9L12 2L22 9V22H14V16H10V22H2Z" 
                fill="white" 
                stroke="white" 
                strokeWidth="1.5"
              />
              <path 
                d="M6 22V12H8V22" 
                stroke="white" 
                strokeWidth="1"
              />
              <path 
                d="M16 22V12H18V22" 
                stroke="white" 
                strokeWidth="1"
              />
            </svg>
          </div>
          
          <h1 className="main-title">
            Civic
            <br />
            Connect
          </h1>
          
          <p className="description">
            Connecting citizens with local services and community updates,
            <br />
            instantly.
          </p>
          
          {isLoading ? (
            <LoadingComponent />
          ) : (
            <button 
              className="get-started-button"
              onClick={() => navigate('/login')}
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;