
const express = require('express');
const Job = require('../models/Job');
const Company = require('../models/Company');
const router = express.Router();

// Get all active jobs for public (careers page)
router.get('/public', async (req, res) => {
  try {
    console.log('Fetching public jobs...');
    const jobs = await Job.find({ isActive: true })
      .populate('company', 'name logo description')
      .sort({ postedDate: -1 })
      .lean();
    
    console.log(`Found ${jobs.length} active jobs`);
    res.json(jobs);
  } catch (error) {
    console.error('Get public jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
});

// Get all jobs (admin)
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all jobs for admin...');
    const jobs = await Job.find()
      .populate('company', 'name logo')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${jobs.length} total jobs`);
    res.json({
      success: true,
      data: jobs
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
});

// Get single job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name logo description contactEmail phoneNumber website');
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
});

// Create new job
router.post('/', async (req, res) => {
  try {
    console.log('Creating new job:', req.body);
    
    // Verify company exists
    const company = await Company.findById(req.body.company);
    if (!company) {
      return res.status(400).json({
        success: false,
        message: 'Company not found'
      });
    }
    
    const job = new Job(req.body);
    await job.save();
    
    // Populate company details
    await job.populate('company', 'name logo');
    
    console.log('Job created successfully:', job._id);
    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create job',
      error: error.message
    });
  }
});

// Update job
router.put('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('company', 'name logo');
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    console.log('Job updated successfully:', job._id);
    res.json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    console.error('Update job error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update job',
      error: error.message
    });
  }
});

// Delete job
router.delete('/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    console.log('Job deleted successfully:', req.params.id);
    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message
    });
  }
});

module.exports = router;
