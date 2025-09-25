const express = require('express');
const router = express.Router();
const {
  sendMobileLoginOTP,
  verifyMobileLoginOTP,
  sendMobileRegistrationOTP,
  verifyMobileRegistrationOTP
} = require('../controllers/mobileOTPController');

// Route for sending login OTP to mobile
router.post('/send-login-otp', sendMobileLoginOTP);

// Route for verifying login OTP
router.post('/verify-login-otp', verifyMobileLoginOTP);

// Route for sending registration OTP to mobile
router.post('/send-registration-otp', sendMobileRegistrationOTP);

// Route for verifying registration OTP
router.post('/verify-registration-otp', verifyMobileRegistrationOTP);

module.exports = router;