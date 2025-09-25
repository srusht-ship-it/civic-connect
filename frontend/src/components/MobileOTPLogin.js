import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendMobileLoginOTP, verifyMobileLoginOTP } from '../services/api';
import './OTPLogin.css';

const MobileOTPLogin = ({ onBackToLogin }) => {
  const [step, setStep] = useState('mobile'); // 'mobile' or 'otp'
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { login } = useAuth();

  // Format mobile number as user types
  const formatMobileNumber = (value) => {
    // Remove all non-digits
    const digitsOnly = value.replace(/\D/g, '');
    
    // Limit to 10 digits
    const limited = digitsOnly.slice(0, 10);
    
    // Add formatting: XXXXX XXXXX
    if (limited.length > 5) {
      return limited.slice(0, 5) + ' ' + limited.slice(5);
    }
    
    return limited;
  };

  const handleMobileSubmit = async (e) => {
    e.preventDefault();
    const cleanMobile = mobileNumber.replace(/\D/g, '');
    
    if (!cleanMobile) {
      setError('Please enter your mobile number');
      return;
    }
    
    if (cleanMobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    if (!/^[6-9]/.test(cleanMobile)) {
      setError('Please enter a valid Indian mobile number starting with 6-9');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await sendMobileLoginOTP({ mobileNumber: cleanMobile });
      setSuccess('OTP sent to your mobile number!');
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
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const cleanMobile = mobileNumber.replace(/\D/g, '');
      const response = await verifyMobileLoginOTP({ 
        mobileNumber: cleanMobile, 
        otp: otpValue 
      });
      
      if (response.data.success) {
        setSuccess('Login successful!');
        login(response.data.data.token, response.data.data.user);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid OTP');
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
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    setError('');

    try {
      const cleanMobile = mobileNumber.replace(/\D/g, '');
      await sendMobileLoginOTP({ mobileNumber: cleanMobile });
      setSuccess('OTP resent to your mobile number!');
      setOtp(['', '', '', '', '', '']);
      startCountdown();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleMobileChange = (e) => {
    const formatted = formatMobileNumber(e.target.value);
    setMobileNumber(formatted);
    setError(''); // Clear error when user starts typing
  };

  if (step === 'mobile') {
    return (
      <div className="otp-login-container">
        <div className="otp-card">
          <div className="otp-header">
            <button 
              className="back-button"
              onClick={onBackToLogin}
              disabled={loading}
            >
              ←
            </button>
            <h2>Login with Mobile OTP</h2>
          </div>

          <p className="otp-subtitle">
            Enter your registered mobile number to receive a verification code
          </p>

          <form onSubmit={handleMobileSubmit} className="otp-form">
            <div className="mobile-input-container">
              <span className="country-code">+91</span>
              <input
                type="text"
                placeholder="Enter mobile number"
                value={mobileNumber}
                onChange={handleMobileChange}
                className="mobile-input"
                disabled={loading}
                autoFocus
              />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <button
              type="submit"
              className="send-otp-button"
              disabled={loading || mobileNumber.replace(/\D/g, '').length !== 10}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>

          <div className="login-help">
            <p>Make sure you have access to your mobile number for OTP verification</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="otp-login-container">
      <div className="otp-card">
        <div className="otp-header">
          <button 
            className="back-button"
            onClick={() => setStep('mobile')}
            disabled={loading}
          >
            ←
          </button>
          <h2>Enter OTP</h2>
        </div>

        <p className="otp-subtitle">
          We've sent a 6-digit code to<br />
          <strong>+91 {mobileNumber}</strong>
        </p>

        <form onSubmit={handleOtpSubmit} className="otp-form">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                name={`otp-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="otp-digit"
                maxLength={1}
                disabled={loading}
                autoFocus={index === 0}
              />
            ))}
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button
            type="submit"
            className="verify-otp-button"
            disabled={loading || otp.join('').length !== 6}
          >
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>
        </form>

        <div className="otp-footer">
          <p>
            Didn't receive the code?{' '}
            {canResend ? (
              <button 
                className="resend-link" 
                onClick={handleResendOTP}
                disabled={loading}
              >
                Resend OTP
              </button>
            ) : (
              <span className="countdown-text">
                Resend in {countdown}s
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileOTPLogin;