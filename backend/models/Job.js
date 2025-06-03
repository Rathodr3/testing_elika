
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'],
    required: [true, 'Job type is required']
  },
  experience: {
    type: String,
    required: [true, 'Experience level is required']
  },
  salary: {
    type: String,
    required: [true, 'Salary range is required']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  requirements: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  applicantsCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
jobSchema.index({ isActive: 1, postedDate: -1 });
jobSchema.index({ company: 1 });
jobSchema.index({ type: 1 });

module.exports = mongoose.model('Job', jobSchema);
