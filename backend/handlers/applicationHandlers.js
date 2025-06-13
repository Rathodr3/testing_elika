
const JobApplication = require('../models/JobApplication');
const fs = require('fs');
const path = require('path');
const { sendApplicationEmail, sendConfirmationEmail } = require('../services/emailService');

const submitApplication = async (req, res) => {
  try {
    const applicationData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      position: req.body.position,
      department: req.body.department,
      experienceLevel: req.body.experienceLevel,
      yearsOfExperience: parseInt(req.body.yearsOfExperience),
      skills: req.body.skills ? req.body.skills.split(',').map(skill => skill.trim()) : [],
      previousCompany: req.body.previousCompany,
      coverLetter: req.body.coverLetter
    };

    // Add resume information if file was uploaded
    if (req.file) {
      applicationData.resumeFilename = req.file.originalname;
      applicationData.resumePath = req.file.path;
    }

    // Create the job application
    const jobApplication = new JobApplication(applicationData);
    await jobApplication.save();

    // Send email notifications
    try {
      await sendApplicationEmail(jobApplication, req.file);
      await sendConfirmationEmail(jobApplication);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the application submission if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Job application submitted successfully',
      data: {
        id: jobApplication._id,
        applicationDate: jobApplication.applicationDate,
        status: jobApplication.status
      }
    });

  } catch (error) {
    // Clean up uploaded file if application creation fails
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.error('Job application submission error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit job application. Please try again.'
    });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const position = req.query.position;
    const department = req.query.department;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (position) filter.position = new RegExp(position, 'i');
    if (department) filter.department = department;

    const skip = (page - 1) * limit;

    const applications = await JobApplication.find(filter)
      .sort({ applicationDate: -1 })
      .skip(skip)
      .limit(limit)
      .select('-resumePath'); // Don't send file paths to frontend

    const total = await JobApplication.countDocuments(filter);

    res.json({
      success: true,
      data: applications,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total: total
      }
    });

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job applications'
    });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
    }

    res.json({
      success: true,
      data: application
    });

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job application'
    });
  }
};

const updateApplication = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Validate years of experience if provided
    if (updateData.yearsOfExperience !== undefined) {
      updateData.yearsOfExperience = parseInt(updateData.yearsOfExperience);
      if (isNaN(updateData.yearsOfExperience) || updateData.yearsOfExperience < 0) {
        return res.status(400).json({
          success: false,
          message: 'Years of experience must be a valid number'
        });
      }
    }

    // Update the application
    const updatedApplication = await JobApplication.findByIdAndUpdate(
      applicationId,
      updateData,
      { 
        new: true, 
        runValidators: true 
      }
    );

    if (!updatedApplication) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
    }

    res.json({
      success: true,
      message: 'Job application updated successfully',
      data: updatedApplication
    });

  } catch (error) {
    console.error('Update application error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update job application'
    });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const validStatuses = ['submitted', 'under-review', 'shortlisted', 'interviewed', 'hired', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { 
        status: status,
        ...(notes && { notes: notes })
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
    }

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update application status'
    });
  }
};

const downloadResume = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);
    
    if (!application || !application.resumePath) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }

    const filePath = path.resolve(application.resumePath);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Resume file not found on server'
      });
    }

    res.download(filePath, application.resumeFilename);

  } catch (error) {
    console.error('Download resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download resume'
    });
  }
};
const deleteApplication = async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Job application not found'
      });
    }

    // Delete resume file if it exists
    if (application.resumePath && fs.existsSync(application.resumePath)) {
      fs.unlinkSync(application.resumePath);
    }

    await JobApplication.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Job application deleted successfully'
    });

  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job application'
    });
  }
};


module.exports = {
  submitApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
  downloadResume,
  deleteApplication
};
