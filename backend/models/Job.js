
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: false // Making it optional for now to handle string company names
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'temporary', 'internship'],
    required: true,
    default: 'full-time'
  },
  domain: {
    type: String,
    required: true,
    trim: true
  },
  workMode: {
    type: String,
    enum: ['remote', 'on-site', 'hybrid'],
    required: true,
    default: 'hybrid'
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead', 'executive'],
    required: true,
    default: 'mid'
  },
  minExperience: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  requirements: [{
    type: String,
    trim: true
  }],
  responsibilities: [{
    type: String,
    trim: true
  }],
  benefits: [{
    type: String,
    trim: true
  }],
  salary: {
    type: String,
    trim: true
  },
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

// Indexes for better query performance
jobSchema.index({ isActive: 1, postedDate: -1 });
jobSchema.index({ company: 1 });
jobSchema.index({ domain: 1 });
jobSchema.index({ experienceLevel: 1 });

// Ensure arrays are always arrays, even if undefined
jobSchema.pre('save', function(next) {
  if (!this.requirements) this.requirements = [];
  if (!this.responsibilities) this.responsibilities = [];
  if (!this.benefits) this.benefits = [];
  next();
});

module.exports = mongoose.model('Job', jobSchema);
