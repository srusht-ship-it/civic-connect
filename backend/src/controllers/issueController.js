const Issue = require('../models/Issue');
const User = require('../models/User');
const mongoose = require('mongoose');

// Create a new issue
const createIssue = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      coordinates,
      voiceTranscription
    } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title and description'
      });
    }

    // Validate coordinates if provided
    if (coordinates && (typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates format'
      });
    }

    // Create new issue
    const newIssue = new Issue({
      title: title.trim(),
      description: description.trim(),
      category: category || 'Other',
      location: location ? location.trim() : 'Location not provided',
      coordinates: coordinates ? {
        lat: parseFloat(coordinates.lat),
        lng: parseFloat(coordinates.lng)
      } : { lat: 0, lng: 0 },
      voiceTranscription: voiceTranscription?.trim() || null,
      reportedBy: req.user.userId // Use userId from JWT payload
    });

    const savedIssue = await newIssue.save();

    // Populate the reportedBy field for response
    await savedIssue.populate('reportedBy', 'fullName email mobileNumber');

    res.status(201).json({
      success: true,
      message: 'Issue reported successfully',
      issue: savedIssue
    });

  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create issue',
      error: error.message
    });
  }
};

// Get all issues (admin only)
const getAllIssues = async (req, res) => {
  try {
    const {
      status,
      category,
      priority,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const issues = await Issue.find(filter)
      .populate('reportedBy', 'fullName email mobileNumber')
      .populate('assignedTo', 'fullName email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalIssues = await Issue.countDocuments(filter);

    res.json({
      success: true,
      issues,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(totalIssues / parseInt(limit)),
        total: totalIssues,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch issues',
      error: error.message
    });
  }
};

// Get issues by user (citizen's own issues)
const getUserIssues = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter
    const filter = { reportedBy: userId };
    if (status) filter.status = status;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const issues = await Issue.find(filter)
      .populate('assignedTo', 'fullName')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const totalIssues = await Issue.countDocuments(filter);

    res.json({
      success: true,
      issues,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(totalIssues / parseInt(limit)),
        total: totalIssues,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error fetching user issues:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user issues',
      error: error.message
    });
  }
};

// Get single issue by ID
const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid issue ID'
      });
    }

    const issue = await Issue.findById(id)
      .populate('reportedBy', 'fullName email mobileNumber')
      .populate('assignedTo', 'fullName email');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Check if user can view this issue
    if (req.user.role === 'citizen' && issue.reportedBy._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own issues'
      });
    }

    res.json({
      success: true,
      issue
    });

  } catch (error) {
    console.error('Error fetching issue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch issue',
      error: error.message
    });
  }
};

// Update issue status (admin only)
const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedTo, adminNotes, estimatedResolutionTime } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid issue ID'
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (assignedTo) updateData.assignedTo = assignedTo;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (estimatedResolutionTime) updateData.estimatedResolutionTime = new Date(estimatedResolutionTime);

    // Set resolvedAt if status is resolved
    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
    }

    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('reportedBy', 'fullName email')
     .populate('assignedTo', 'fullName email');

    if (!updatedIssue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.json({
      success: true,
      message: 'Issue updated successfully',
      issue: updatedIssue
    });

  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update issue',
      error: error.message
    });
  }
};

// Delete issue (admin only)
const deleteIssue = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid issue ID'
      });
    }

    const deletedIssue = await Issue.findByIdAndDelete(id);

    if (!deletedIssue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.json({
      success: true,
      message: 'Issue deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting issue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete issue',
      error: error.message
    });
  }
};

// Get issue statistics (admin only)
const getIssueStatistics = async (req, res) => {
  try {
    const stats = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalIssues = await Issue.countDocuments();
    const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });
    const pendingIssues = await Issue.countDocuments({ status: 'pending' });
    const inProgressIssues = await Issue.countDocuments({ status: 'in-progress' });

    res.json({
      success: true,
      statistics: {
        total: totalIssues,
        resolved: resolvedIssues,
        pending: pendingIssues,
        inProgress: inProgressIssues,
        byStatus: stats,
        byCategory: categoryStats
      }
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

// Assign issue to department
const assignIssueToDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { department } = req.body;

    // Validate department
    const validDepartments = ['public-works', 'transportation', 'sanitation', 'water-supply', 'electricity', 'housing', 'health', 'education', 'parks', 'security'];
    if (!department || !validDepartments.includes(department)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid department. Must be one of: ' + validDepartments.join(', ')
      });
    }

    // Validate issue ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid issue ID format'
      });
    }

    // Find and update the issue
    const issue = await Issue.findById(id).populate('reportedBy', 'fullName email');
    
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Update issue with department assignment and change status to in-progress
    issue.department = department;
    issue.status = 'in-progress';
    issue.assignedTo = req.user.userId; // Admin who assigned it
    
    const updatedIssue = await issue.save();
    await updatedIssue.populate('assignedTo', 'fullName email');

    res.json({
      success: true,
      message: 'Issue assigned to department successfully',
      issue: updatedIssue
    });

  } catch (error) {
    console.error('Error assigning issue:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assign issue to department',
      error: error.message
    });
  }
};

module.exports = {
  createIssue,
  getAllIssues,
  getUserIssues,
  getIssueById,
  updateIssueStatus,
  deleteIssue,
  getIssueStatistics,
  assignIssueToDepartment
};