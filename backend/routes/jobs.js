
const express = require('express');
const Job = require('../models/Job');
const router = express.Router();

// Get all active jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .sort({ postedDate: -1 })
      .lean();
    
    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs'
    });
  }
});

// Get single job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).lean();
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job'
    });
  }
});

// Create new job (admin only - for future use)
router.post('/', async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    
    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create job'
    });
  }
});

module.exports = router;
