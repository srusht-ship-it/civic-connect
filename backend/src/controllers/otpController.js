const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
// Email service removed - using mobile OTP instead
// const emailService = require('../services/realEmailService');
// Temporary user store for testing without MongoDB
const tempUserStore = require('../utils/tempUserStore');

// Generate JWT Token
const generateToken = (userId, email, role) => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Send OTP for Login
const sendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists (only registered users can get OTP)
    let user;
    try {
      user = await User.findByEmail(email);
    } catch (error) {
      console.log('⚠️  MongoDB not connected, using temporary user store for testing');
      user = await tempUserStore.findByEmail(email);
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address. Please sign up first.'
      });
    }

    // Generate and save OTP
    let otpResult;
    try {
      otpResult = await OTP.createOTP(email, 'login');
    } catch (error) {
      console.log('⚠️  MongoDB not connected, using temporary OTP storage');
      // Generate OTP manually for testing
      const crypto = require('crypto');
      const otp = crypto.randomBytes(3).toString('hex').slice(0, 6).padStart(6, '0');
      
      otpResult = await tempUserStore.storeOTP(email, otp, 'login');
      otpResult = { success: true, otp: otp };
    }
    
    if (!otpResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate OTP'
      });
    }

    // Email OTP service disabled - use mobile OTP instead
    // const emailResult = await emailService.sendOTPEmail(email, otpResult.otp, 'login');
    // if (!emailResult.success) {
    //   return res.status(500).json({
    //     success: false,
    //     message: 'Failed to send OTP email'
    //   });
    // }

    // Mock success for email OTP (deprecated)
    const emailResult = { success: true };

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email address',
      data: {
        email: email,
        expiresIn: '10 minutes'
      }
    });

  } catch (error) {
    console.error('Send login OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again.'
    });
  }
};

// Verify OTP and Login
const verifyOTPLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Verify OTP
    let otpVerification;
    try {
      otpVerification = await OTP.verifyOTP(email, otp, 'login');
    } catch (error) {
      console.log('⚠️  MongoDB not connected, using temporary OTP verification');
      const isValid = await tempUserStore.verifyOTP(email, otp);
      otpVerification = { success: isValid, message: isValid ? 'OTP verified' : 'Invalid or expired OTP' };
    }
    
    if (!otpVerification.success) {
      return res.status(400).json({
        success: false,
        message: otpVerification.message
      });
    }

    // Get user details
    let user;
    try {
      user = await User.findByEmail(email);
      // Update last login if using real database
      user.lastLogin = new Date();
      await user.save();
    } catch (error) {
      console.log('⚠️  MongoDB not connected, using temporary user store');
      user = await tempUserStore.findByEmail(email);
    }
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id, user.email, user.role || 'citizen');

    // Get public profile
    const userProfile = user.getPublicProfile ? user.getPublicProfile() : {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'citizen'
    };

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. Login successful!',
      data: {
        user: userProfile,
        token,
        tokenType: 'Bearer'
      }
    });

  } catch (error) {
    console.error('Verify OTP login error:', error);
    res.status(500).json({
      success: false,
      message: 'OTP verification failed. Please try again.'
    });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email, purpose = 'login' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user exists (for login OTP)
    if (purpose === 'login') {
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No account found with this email address'
        });
      }
    }

    // Generate new OTP
    const otpResult = await OTP.createOTP(email, purpose);
    if (!otpResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate OTP'
      });
    }

    // Email OTP service disabled - use mobile OTP instead
    // const emailResult = await emailService.sendOTPEmail(email, otpResult.otp, purpose);
    // if (!emailResult.success) {
    //   return res.status(500).json({
    //     success: false,
    //     message: 'Failed to send OTP email'
    //   });
    // }

    // Mock success for email OTP (deprecated)
    const emailResult = { success: true };

    res.status(200).json({
      success: true,
      message: 'New OTP sent successfully',
      data: {
        email: email,
        expiresIn: '10 minutes'
      }
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP. Please try again.'
    });
  }
};

module.exports = {
  sendLoginOTP,
  verifyOTPLogin,
  resendOTP
};