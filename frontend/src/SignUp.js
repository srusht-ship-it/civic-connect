import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);

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

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Mobile validation
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/[^\d]/g, ''))) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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

  const handleSignUp = (e) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length === 0) {
      // Handle successful signup
      console.log('Signup successful:', formData);
      // Navigate to login page after successful signup
      navigate('/login');
    } else {
      setErrors(formErrors);
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
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              required
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
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
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              className={errors.mobile ? 'error' : ''}
              required
            />
            {errors.mobile && <div className="error-message">{errors.mobile}</div>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
              required
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={errors.confirmPassword ? 'error' : ''}
              required
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>

          <div className="terms-section">
            <label className="terms-checkbox">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <span className="checkmark"></span>
              <span className="terms-text">
                Agree to <a href="/terms" className="terms-link" target="_blank" rel="noopener noreferrer">Terms & Privacy Policy</a>
              </span>
            </label>
            {errors.terms && <div className="error-message">{errors.terms}</div>}
          </div>

          <button type="submit" className="create-account-button">
            Create Account
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