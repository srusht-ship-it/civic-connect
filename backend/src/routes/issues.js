const express = require('express');
const router = express.Router();
const {
  createIssue,
  getAllIssues,
  getUserIssues,
  getIssueById,
  updateIssueStatus,
  deleteIssue,
  getIssueStatistics
} = require('../controllers/issueController');
const { authenticateToken } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// Admin only routes
router.get('/admin/statistics', authenticateToken, adminAuth, getIssueStatistics); // Get statistics
router.get('/', authenticateToken, adminAuth, getAllIssues);         // Get all issues (admin only)

// Public routes (require authentication)
router.post('/', authenticateToken, createIssue);                    // Create new issue
router.get('/my-issues', authenticateToken, getUserIssues);          // Get user's own issues
router.get('/:id', authenticateToken, getIssueById);                 // Get single issue by ID

// Admin only routes for specific issues
router.put('/:id/status', authenticateToken, adminAuth, updateIssueStatus); // Update issue status
router.delete('/:id', authenticateToken, adminAuth, deleteIssue);    // Delete issue

module.exports = router;