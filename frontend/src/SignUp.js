import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = 'Full name can only contain letters and spaces';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Phone Number validation (optional)
    if (formData.phoneNumber && !/^\+?[\d\s-()]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement validation
    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the Terms & Privacy Policy';
    }

    return newErrors;
  };

  const handleSignUp = async (e) => {
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
      // Call register API
      const result = await register(formData);
      
      if (result.success) {
        // Navigate to dashboard on successful registration
        navigate('/dashboard');
      } else {
        // Handle registration errors
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
      console.error('Registration error:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    }
  };

  const handleLoginRedirect = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        {/* Left Panel - Brand Section */}
        <div className="signup-left-panel">
          <div className="brand-section">
            <div className="brand-icon-large">
              <svg className="signup-civic-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              Join our community and access seamless civic services designed for modern citizens
            </p>
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">🏛️</span>
                <span>Government Services</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🤝</span>
                <span>Community Engagement</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📋</span>
                <span>Issue Reporting</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Signup Form */}
        <div className="signup-right-panel">
          <div className="signup-header">
            <h1 className="signup-title">Create Account</h1>
            <p className="signup-subtitle">Join Civic Connect today</p>
          </div>

          <div className="signup-badge">
            <svg className="shield-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1L3 5v6c0 5.55 3.84 10.74 9 11 5.16-.26 9-5.45 9-11V5l-7-4zM8 14l-3-3 1.5-1.5L8 11l5.5-5.5L15 7l-7 7z" clipRule="evenodd"/>
            </svg>
            Simple, secure signup
          </div>

          <form className="signup-form" onSubmit={handleSignUp}>
          {/* General error message */}
          {(errors.general || error) && (
            <div className="error-message general-error">
              {errors.general || error}
            </div>
          )}

          <div className="form-group">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className={errors.fullName ? 'error' : ''}
              required
              disabled={loading}
            />
            {errors.fullName && <div className="error-message">{errors.fullName}</div>}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              required
              disabled={loading}
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number (Optional)"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={errors.phoneNumber ? 'error' : ''}
              disabled={loading}
            />
            {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
          </div>

          <div className="form-group">
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                required
                disabled={loading}
              />
              <button 
                type="button" 
                className="show-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-group">
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={errors.confirmPassword ? 'error' : ''}
                required
                disabled={loading}
              />
              <button 
                type="button" 
                className="show-password-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
              </button>
            </div>
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>

          <div className="terms-section">
            <label className="terms-checkbox">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                disabled={loading}
              />
              <span className="checkmark"></span>
              <span className="terms-text">
                Agree to <a href="/terms" className="terms-link" target="_blank" rel="noopener noreferrer">Terms & Privacy Policy</a>
              </span>
            </label>
            {errors.terms && <div className="error-message">{errors.terms}</div>}
          </div>

          <button type="submit" className="create-account-button" disabled={loading}>
            {loading ? (
              <span className="loading-spinner">
                <svg className="spinner" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25"/>
                  <path fill="currentColor" opacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

          <div className="login-redirect-section">
            <p className="already-have-account">Already have an account?</p>
            <div className="login-links">
              <button className="back-button" onClick={handleBackToLogin}>
                Back to
              </button>
              <button className="login-link-button" onClick={handleLoginRedirect}>
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;