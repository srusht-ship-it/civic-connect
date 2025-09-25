const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const mobileOTPService = require('../services/mobileOTPService');
const tempUserStore = require('../utils/tempUserStore');

// Generate JWT Token
const generateToken = (userId, mobileNumber, role) => {
  return jwt.sign(
    { userId, mobileNumber, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Send OTP for Mobile Login
const sendMobileLoginOTP = async (req, res) => {
  try {
    console.log('=== SEND MOBILE LOGIN OTP START ===');
    console.log('Request body:', req.body);
    
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
      console.log('ERROR: Mobile number missing');
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }

    console.log('Step 1: Validating mobile number:', mobileNumber);
    
    // Validate and format mobile number
    const { isValid, formattedNumber, error } = mobileOTPService.validateAndFormatMobileNumber(mobileNumber);
    
    console.log('Validation result:', { isValid, formattedNumber, error });
    
    if (!isValid) {
      console.log('ERROR: Mobile validation failed:', error);
      return res.status(400).json({
        success: false,
        message: error
      });
    }

    console.log('Step 2: Looking for existing user with mobile:', formattedNumber);

    // Check if user exists (only registered users can get OTP)
    let user;
    try {
      user = await User.findByMobile(formattedNumber);
      console.log('MongoDB user lookup result:', user ? 'User found' : 'User not found');
    } catch (error) {
      console.log('MongoDB not connected, using temporary user store for testing');
      user = await tempUserStore.findByMobile(formattedNumber);
      console.log('TempStore user lookup result:', user ? 'User found' : 'User not found');
      if (user) {
        console.log('Found user:', { mobile: user.mobileNumber, name: user.fullName });
      }
    }
    
    if (!user) {
      console.log('ERROR: No user found with mobile number:', formattedNumber);
      return res.status(404).json({
        success: false,
        message: 'No account found with this mobile number. Please register first.'
      });
    }

    console.log('Step 3: Generating OTP for user');

    // Generate and save OTP
    let otpResult;
    try {
      console.log('Attempting to create OTP using MongoDB...');
      otpResult = await OTP.createMobileOTP(formattedNumber, 'login');
      console.log('MongoDB OTP result:', otpResult);
    } catch (error) {
      console.log('MongoDB OTP failed, using temporary OTP store for testing');
      otpResult = await tempUserStore.createMobileOTP(formattedNumber, 'login');
      console.log('TempStore OTP result:', otpResult);
    }

    if (!otpResult.success) {
      console.log('ERROR: Failed to generate OTP:', otpResult);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate OTP. Please try again.'
      });
    }

    console.log('Step 4: OTP Generated Successfully:', otpResult.otp);
    console.log(`Generated OTP for ${formattedNumber}: ${otpResult.otp}`); // ✅ Fixed template literal
    console.log('Step 5: Sending SMS...');

    // Send SMS with OTP
    const smsResult = await mobileOTPService.sendOTP(formattedNumber, otpResult.otp, 'login');
    
    console.log('SMS Result:', smsResult);
    
    if (!smsResult.success) {
      console.log('ERROR: SMS sending failed:', smsResult);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.'
      });
    }

    console.log('SUCCESS: OTP process completed successfully');
    console.log('=== SEND MOBILE LOGIN OTP END ===');

    res.status(200).json({
      success: true,
      message: `OTP sent successfully to ${formattedNumber}`,
      data: {
        mobileNumber: formattedNumber,
        expiresIn: '10 minutes'
      }
    });

  } catch (error) {
    console.error('CRITICAL ERROR in sendMobileLoginOTP:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending OTP'
    });
  }
};

// Send OTP for Mobile Registration
const sendMobileRegistrationOTP = async (req, res) => {
  try {
    console.log('=== SEND MOBILE REGISTRATION OTP START ===');
    console.log('Request body:', req.body);
    
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
      console.log('ERROR: Mobile number missing');
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }

    console.log('Step 1: Validating mobile number:', mobileNumber);

    // Validate and format mobile number
    const { isValid, formattedNumber, error } = mobileOTPService.validateAndFormatMobileNumber(mobileNumber);
    
    console.log('Validation result:', { isValid, formattedNumber, error });
    
    if (!isValid) {
      console.log('ERROR: Mobile validation failed:', error);
      return res.status(400).json({
        success: false,
        message: error
      });
    }

    console.log('Step 2: Checking if user already exists');

    // Check if user already exists
    let existingUser;
    try {
      existingUser = await User.findByMobile(formattedNumber);
      console.log('MongoDB user check:', existingUser ? 'User exists' : 'User not found');
    } catch (error) {
      console.log('MongoDB not connected, using temporary user store for testing');
      existingUser = await tempUserStore.findByMobile(formattedNumber);
      console.log('TempStore user check:', existingUser ? 'User exists' : 'User not found');
    }
    
    if (existingUser) {
      console.log('ERROR: User already exists with mobile:', formattedNumber);
      return res.status(400).json({
        success: false,
        message: 'Account already exists with this mobile number. Please login instead.'
      });
    }

    console.log('Step 3: Generating registration OTP');

    // Generate and save OTP
    let otpResult;
    try {
      console.log('Attempting to create OTP using MongoDB...');
      otpResult = await OTP.createMobileOTP(formattedNumber, 'registration');
      console.log('MongoDB OTP result:', otpResult);
    } catch (error) {
      console.log('MongoDB OTP failed, using temporary OTP store for testing');
      otpResult = await tempUserStore.createMobileOTP(formattedNumber, 'registration');
      console.log('TempStore OTP result:', otpResult);
    }

    if (!otpResult.success) {
      console.log('ERROR: Failed to generate OTP:', otpResult);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate OTP. Please try again.'
      });
    }

    console.log('Step 4: OTP Generated Successfully:', otpResult.otp);
    console.log(`Generated OTP for ${formattedNumber}: ${otpResult.otp}`); // ✅ Fixed template literal
    console.log('Step 5: Sending SMS...');

    // Send SMS with OTP
    const smsResult = await mobileOTPService.sendOTP(formattedNumber, otpResult.otp, 'registration');
    
    console.log('SMS Result:', smsResult);
    
    if (!smsResult.success) {
      console.log('ERROR: SMS sending failed:', smsResult);
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.'
      });
    }

    console.log('SUCCESS: Registration OTP process completed successfully');
    console.log('=== SEND MOBILE REGISTRATION OTP END ===');

    res.status(200).json({
      success: true,
      message: `Verification OTP sent successfully to ${formattedNumber}`,
      data: {
        mobileNumber: formattedNumber,
        expiresIn: '10 minutes'
      }
    });

  } catch (error) {
    console.error('CRITICAL ERROR in sendMobileRegistrationOTP:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending OTP'
    });
  }
};

// Verify Mobile OTP and Login
const verifyMobileLoginOTP = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    if (!mobileNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number and OTP are required'
      });
    }

    // Validate and format mobile number
    const { isValid, formattedNumber, error } = mobileOTPService.validateAndFormatMobileNumber(mobileNumber);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: error
      });
    }

    // Verify OTP
    let otpVerification;
    try {
      otpVerification = await OTP.verifyMobileOTP(formattedNumber, otp, 'login');
    } catch (error) {
      console.log('MongoDB not connected, using temporary OTP store for testing');
      otpVerification = await tempUserStore.verifyMobileOTP(formattedNumber, otp, 'login');
    }

    if (!otpVerification.success) {
      return res.status(400).json({
        success: false,
        message: otpVerification.message
      });
    }

    // Find user and update mobile verification status
    let user;
    try {
      user = await User.findByMobile(formattedNumber);
      if (user && !user.isMobileVerified) {
        user.isMobileVerified = true;
        user.lastLogin = new Date();
        await user.save();
      }
    } catch (error) {
      console.log('MongoDB not connected, using temporary user store for testing');
      user = await tempUserStore.findByMobile(formattedNumber);
      if (user) {
        user.isMobileVerified = true;
        user.lastLogin = new Date().toISOString();
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id || user.id, formattedNumber, user.role);
    const publicProfile = user.getPublicProfile ? user.getPublicProfile() : {
      id: user._id || user.id,
      fullName: user.fullName,
      mobileNumber: formattedNumber,
      email: user.email,
      role: user.role,
      isMobileVerified: true
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: publicProfile,
        expiresIn: '7 days'
      }
    });

  } catch (error) {
    console.error('Verify mobile login OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login verification'
    });
  }
};

// Verify Mobile Registration OTP
const verifyMobileRegistrationOTP = async (req, res) => {
  try {
    const { mobileNumber, otp } = req.body;

    if (!mobileNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number and OTP are required'
      });
    }

    // Validate and format mobile number
    const { isValid, formattedNumber, error } = mobileOTPService.validateAndFormatMobileNumber(mobileNumber);
    
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: error
      });
    }

    // Verify OTP
    let otpVerification;
    try {
      otpVerification = await OTP.verifyMobileOTP(formattedNumber, otp, 'registration');
    } catch (error) {
      console.log('MongoDB not connected, using temporary OTP store for testing');
      otpVerification = await tempUserStore.verifyMobileOTP(formattedNumber, otp, 'registration');
    }

    if (!otpVerification.success) {
      return res.status(400).json({
        success: false,
        message: otpVerification.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Mobile number verified successfully. You can now complete your registration.',
      data: {
        mobileNumber: formattedNumber,
        verified: true
      }
    });

  } catch (error) {
    console.error('Verify mobile registration OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during mobile verification'
    });
  }
};

module.exports = {
  sendMobileLoginOTP,
  verifyMobileLoginOTP,
  sendMobileRegistrationOTP,
  verifyMobileRegistrationOTP
};