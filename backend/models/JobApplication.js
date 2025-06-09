
const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
  },
  
  // Job Information
  position: {
    type: String,
    required: [true, 'Position is required'],
    trim: true
  },
  department: {
    type: String,
    enum: ['Engineering', 'Consulting', 'Training', 'Software Development', 'Management'],
    required: [true, 'Department is required']
  },
  experienceLevel: {
    type: String,
    enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
    required: [true, 'Experience level is required']
  },
  
  // Experience & Skills
  yearsOfExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Years of experience cannot be negative'],
    max: [50, 'Years of experience cannot exceed 50']
  },
  skills: [{
    type: String,
    trim: true
  }],
  previousCompany: {
    type: String,
    trim: true
  },
  
  // Cover Letter & Resume
  coverLetter: {
    type: String,
    maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
  },
  resumeFilename: {
    type: String
  },
  resumePath: {
    type: String
  },
  
  // Application Status - Updated to match frontend expectations
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'interviewed', 'hired', 'rejected', 'submitted', 'under-review', 'shortlisted'],
    default: 'pending'
  },
  
  // Metadata
  applicationDate: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    default: 'website'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  }
}, {
  timestamps: true
});

// Index for efficient queries
jobApplicationSchema.index({ email: 1, position: 1 });
jobApplicationSchema.index({ status: 1 });
jobApplicationSchema.index({ applicationDate: -1 });

// Virtual field to combine first and last name
jobApplicationSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
jobApplicationSchema.set('toJSON', { virtuals: true });
jobApplicationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
