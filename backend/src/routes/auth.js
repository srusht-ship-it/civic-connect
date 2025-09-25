const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Import controllers and middleware
const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser
} = require('../controllers/authController');

const {
  authenticateToken,
  handleValidationErrors,
  createRateLimit
} = require('../middleware/auth');

// Rate limiting for auth routes
const authRateLimit = createRateLimit(15 * 60 * 1000, 5); // 5 attempts per 15 minutes

// Validation rules
const registerValidation = [
  body('fullName')
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Full name can only contain letters and spaces'),
    
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    
  body('confirmPassword')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
    
  body('phoneNumber')
    .optional()
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number')
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Routes

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', 
  authRateLimit,
  registerValidation,
  handleValidationErrors,
  registerUser
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login',
  authRateLimit,
  loginValidation,
  handleValidationErrors,
  loginUser
);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile',
  authenticateToken,
  getCurrentUser
);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout',
  authenticateToken,
  logoutUser
);

// @route   GET /api/auth/verify-token
// @desc    Verify if token is valid
// @access  Private
router.get('/verify-token', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    data: {
      userId: req.user.userId,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;