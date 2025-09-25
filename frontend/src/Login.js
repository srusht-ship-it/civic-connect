import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { navigateToDashboard } from './utils/navigationUtils';
import OTPLogin from './components/OTPLogin';
import MobileOTPLogin from './components/MobileOTPLogin';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPLogin, setShowOTPLogin] = useState(false);
  const [showMobileOTPLogin, setShowMobileOTPLogin] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Clear previous errors
    setErrors({});
    clearError();
    
    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      // Call login API
      const result = await login({ email, password });
      
      if (result.success) {
        // Navigate based on user role using utility function
        navigateToDashboard(navigate, result.user);
      } else {
        // Handle login errors
        if (result.errors && result.errors.length > 0) {
          const apiErrors = {};
          result.errors.forEach(error => {
            apiErrors[error.field] = error.message;
          });
          setErrors(apiErrors);
        } else {
          setErrors({ general: result.message });
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Login failed. Please try again.' });
    }
  };

  const handleGoogleLogin = () => {
    // Handle Google login
    console.log('Google login clicked');
  };

  const handleMobileOTP = () => {
    // Show Mobile OTP login component
    setShowMobileOTPLogin(true);
  };

  const handleEmailOTP = () => {
    // Show Email OTP login component  
    setShowOTPLogin(true);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    // Navigate to sign up page
    navigate('/signup');
  };

  return (
    <>
      {showMobileOTPLogin ? (
        <MobileOTPLogin onBackToLogin={() => setShowMobileOTPLogin(false)} />
      ) : showOTPLogin ? (
        <OTPLogin onBackToLogin={() => setShowOTPLogin(false)} />
      ) : (
        <div className="login-container">
      <div className="login-card">
        {/* Left Panel - Brand Section */}
        <div className="login-left-panel">
          <div className="brand-section">
            <div className="brand-icon-large">
              <svg className="login-civic-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <h1 className="brand-title-large">Civic Connect</h1>
            <p className="brand-subtitle-large">
              Your digital gateway to seamless civic engagement and community services
            </p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="login-right-panel">
          <div className="login-header">
            <h1 className="login-title">Welcome back</h1>
            <p className="login-subtitle">Sign in to your account</p>
          </div>

          <div className="secure-login-badge">
            <svg className="shield-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1L3 5v6c0 5.55 3.84 10.74 9 11 5.16-.26 9-5.45 9-11V5l-7-4zM8 14l-3-3 1.5-1.5L8 11l5.5-5.5L15 7l-7 7z" clipRule="evenodd"/>
            </svg>
            Secure login
          </div>

          <form className="login-form" onSubmit={handleLogin}>
          {/* General error message */}
          {(errors.general || error) && (
            <div className="error-message general-error">
              {errors.general || error}
            </div>
          )}
          
          <div className="form-group">
            <div className={`input-container ${errors.email ? 'error' : ''}`}>
              <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({...errors, email: ''});
                }}
                required
              />
            </div>
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <div className={`input-container ${errors.password ? 'error' : ''}`}>
              <svg className="input-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
              </svg>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({...errors, password: ''});
                }}
                required
              />
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="forgot-password">
            <a href="#forgot">Forgot password?</a>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <span className="loading-spinner">
                <svg className="spinner" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                  <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Signing in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="divider-section">
          <div className="divider-line"></div>
        </div>

        <div className="alternative-login">
          <button className="google-login-button" onClick={handleGoogleLogin}>
            <svg className="google-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Login with Google
          </button>

          <button className="mobile-otp-button" onClick={handleMobileOTP}>
            <svg className="mobile-icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 011 1v11a1 1 0 01-1 1H5a1 1 0 01-1-1V7zM9 10a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            </svg>
            Login with Mobile OTP
          </button>

          <button className="email-otp-button" onClick={handleEmailOTP}>
            <svg className="email-icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
            Login with Email OTP
          </button>
        </div>

          <div className="signup-section">
            <p className="new-here">New here?</p>
            <p className="signup-prompt">
              Don't have an account? <a href="#signup" className="signup-link" onClick={handleSignUp}>Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
      )}
    </>
  );
};

export default Login;