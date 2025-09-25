import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendLoginOTP, verifyLoginOTP, resendOTP } from '../services/api';
import './OTPLogin.css';

const OTPLogin = ({ onBackToLogin }) => {
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { login } = useAuth();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendLoginOTP({ email });
      setSuccess('OTP sent to your email!');
      setStep('otp');
      startCountdown();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await verifyLoginOTP({ email, otp: otpString });
      login(response.data.token, response.data.user);
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');

    try {
      await resendOTP({ email });
      setSuccess('New OTP sent to your email!');
      setOtp(['', '', '', '', '', '']);
      startCountdown();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const startCountdown = () => {
    setCanResend(false);
    setCountdown(60);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="otp-login">
      <div className="otp-login-container">
        <div className="otp-login-header">
          <button className="back-btn" onClick={onBackToLogin}>
            ← Back to Login
          </button>
          <h2>Login with OTP</h2>
          <p>Enter your email to receive a one-time password</p>
        </div>

        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="email-form">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button type="submit" className="send-otp-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <div className="otp-verification">
            <div className="otp-info">
              <p>We've sent a 6-digit OTP to</p>
              <strong>{email}</strong>
            </div>

            <form onSubmit={handleOtpSubmit}>
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="otp-input"
                    maxLength="1"
                    disabled={loading}
                  />
                ))}
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <button type="submit" className="verify-otp-btn" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>

            <div className="resend-section">
              <p>Didn't receive the OTP?</p>
              {canResend ? (
                <button onClick={handleResendOTP} className="resend-btn" disabled={loading}>
                  Resend OTP
                </button>
              ) : (
                <span className="countdown">Resend in {countdown}s</span>
              )}
            </div>

            <button 
              onClick={() => {
                setStep('email');
                setOtp(['', '', '', '', '', '']);
                setError('');
                setSuccess('');
              }} 
              className="change-email-btn"
            >
              Change Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPLogin;