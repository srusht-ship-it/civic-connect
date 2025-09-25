const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Issue title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Issue description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Pothole', 'Streetlight', 'Garbage', 'Water Supply', 'Sewage', 'Road Damage', 'Traffic', 'Other'],
    default: 'Other'
  },
  location: {
    type: String,
    required: false,
    trim: true,
    default: 'Location not provided'
  },
  coordinates: {
    lat: {
      type: Number,
      required: false,
      default: 0
    },
    lng: {
      type: Number,
      required: false,
      default: 0
    }
  },
  image: {
    type: String, // URL or path to uploaded image
    default: null
  },
  voiceRecording: {
    type: String, // URL or path to uploaded voice recording
    default: null
  },
  voiceTranscription: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  department: {
    type: String,
    enum: ['public-works', 'transportation', 'sanitation', 'water-supply', 'electricity', 'housing', 'health', 'education', 'parks', 'security'],
    default: null
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Reporter is required']
  },
  adminNotes: {
    type: String,
    default: null
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  estimatedResolutionTime: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Index for efficient queries
issueSchema.index({ status: 1, createdAt: -1 });
issueSchema.index({ reportedBy: 1 });
issueSchema.index({ coordinates: '2dsphere' }); // For location-based queries

// Virtual for issue age in days
issueSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Method to check if issue is overdue
issueSchema.methods.isOverdue = function() {
  if (!this.estimatedResolutionTime) return false;
  return Date.now() > this.estimatedResolutionTime;
};

module.exports = mongoose.model('Issue', issueSchema);