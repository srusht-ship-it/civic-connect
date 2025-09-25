const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Import controllers and middleware
const {
  sendLoginOTP,
  verifyOTPLogin,
  resendOTP
} = require('../controllers/otpController');

const {
  handleValidationErrors,
  createRateLimit
} = require('../middleware/auth');

// Rate limiting for OTP routes (more restrictive)
const otpRateLimit = createRateLimit(15 * 60 * 1000, 3); // 3 attempts per 15 minutes

// Validation rules
const sendOTPValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
];

const verifyOTPValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers')
];

const resendOTPValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('purpose')
    .optional()
    .isIn(['login', 'registration', 'password_reset'])
    .withMessage('Invalid purpose specified')
];

// Routes

// @route   POST /api/otp/send-login-otp
// @desc    Send OTP for login via email
// @access  Public
router.post('/send-login-otp',
  otpRateLimit,
  sendOTPValidation,
  handleValidationErrors,
  sendLoginOTP
);

// @route   POST /api/otp/verify-login-otp
// @desc    Verify OTP and login user
// @access  Public
router.post('/verify-login-otp',
  otpRateLimit,
  verifyOTPValidation,
  handleValidationErrors,
  verifyOTPLogin
);

// @route   POST /api/otp/resend
// @desc    Resend OTP
// @access  Public
router.post('/resend',
  otpRateLimit,
  resendOTPValidation,
  handleValidationErrors,
  resendOTP
);

// @route   GET /api/otp/test
// @desc    Test OTP service
// @access  Public (for development only)
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'OTP service is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;