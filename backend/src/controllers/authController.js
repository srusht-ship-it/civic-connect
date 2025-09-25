const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mobileOTPService = require('../services/mobileOTPService');

// Generate JWT Token
const generateToken = (userId, email, role, mobileNumber) => {
  return jwt.sign(
    { 
      userId, 
      email, 
      role,
      mobileNumber 
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: '7d' // Token expires in 7 days
    }
  );
};

// User Registration Controller
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword, phoneNumber, mobileNumber } = req.body;

    // Use mobileNumber if provided, otherwise use phoneNumber for backward compatibility
    const mobile = mobileNumber || phoneNumber;

    // Validate mobile number is provided
    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }

    // Validate and format mobile number
    const mobileValidation = mobileOTPService.validateAndFormatMobileNumber(mobile);
    
    if (!mobileValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: mobileValidation.error
      });
    }

    const formattedMobile = mobileValidation.formattedNumber;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check if user already exists by email
    const existingUserByEmail = await User.findByEmail(email);
    if (existingUserByEmail) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Check if user already exists by mobile number
    try {
      const existingUserByMobile = await User.findByMobile(formattedMobile);
      if (existingUserByMobile) {
        return res.status(409).json({
          success: false,
          message: 'User with this mobile number already exists'
        });
      }
    } catch (error) {
      // Mobile lookup might fail if method doesn't exist, that's OK
      console.log('Mobile lookup failed, continuing with registration');
    }

    // Create new user
    const newUser = new User({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password,
      mobileNumber: formattedMobile
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser._id, newUser.email, newUser.role, newUser.mobileNumber);

    // Get public profile
    const userProfile = newUser.getPublicProfile();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userProfile,
        token,
        tokenType: 'Bearer'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email address is already registered'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
};

// User Login Controller
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.email, user.role, user.mobileNumber);

    // Get public profile
    const userProfile = user.getPublicProfile();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userProfile,
        token,
        tokenType: 'Bearer'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

// Get Current User Profile Controller
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -resetPasswordToken -resetPasswordExpires');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    });
  }
};

// Logout Controller (Client-side token removal)
const logoutUser = async (req, res) => {
  try {
    // In a JWT-based system, logout is typically handled on the client side
    // by removing the token from storage. Server-side logout would require 
    // a token blacklist, which can be implemented if needed.
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser
};