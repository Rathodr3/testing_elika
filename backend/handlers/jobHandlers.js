
const Job = require('../models/Job');
const Company = require('../models/Company');

// Helper function to format job data consistently
const formatJobForResponse = (job, isPublic = false) => {
  const companyName = job.company?.name || 'Elika Engineering Pvt Ltd';
  const postedDate = job.createdAt || job.postedDate || new Date();
  
  const formattedJob = {
    ...job,
    id: isPublic ? job._id.toString() : job._id,
    _id: job._id,
    company: job.company || { name: companyName },
    requirements: Array.isArray(job.requirements) ? job.requirements : 
      (typeof job.requirements === 'string' ? [job.requirements] : []),
    responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities : 
      (typeof job.responsibilities === 'string' ? [job.responsibilities] : []),
    benefits: Array.isArray(job.benefits) ? job.benefits : 
      (typeof job.benefits === 'string' ? [job.benefits] : []),
    postedDate: postedDate,
    applicantsCount: job.applicantsCount || 0
  };

  if (isPublic) {
    formattedJob.posted = new Date(postedDate).toLocaleDateString();
    formattedJob.applicants = job.applicantsCount || 0;
    formattedJob.experience = `${job.minExperience}+ years`;
    formattedJob.type = `${job.employmentType} • ${job.workMode}`;
  }

  return formattedJob;
};

const getAllPublicJobs = async (req, res) => {
  try {
    console.log('🔍 Fetching public jobs...');
    const jobs = await Job.find({ isActive: true })
      .populate('company', 'name logo description contactEmail phoneNumber website')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`✅ Found ${jobs.length} active jobs for public`);
    
    const formattedJobs = jobs.map(job => {
      console.log('🔄 Formatting job for public:', job.title);
      return formatJobForResponse(job, true);
    });
    
    console.log('✅ Formatted jobs for public:', formattedJobs.length);
    res.json(formattedJobs);
  } catch (error) {
    console.error('❌ Get public jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

const getAllJobs = async (req, res) => {
  try {
    console.log('🔍 Fetching all jobs for admin...');
    const jobs = await Job.find()
      .populate('company', 'name logo description contactEmail phoneNumber website')
      .sort({ createdAt: -1 })
      .lean();
    
    console.log(`✅ Found ${jobs.length} total jobs for admin`);
    
    const formattedJobs = jobs.map(job => {
      console.log('🔄 Formatting job for admin:', job.title);
      return formatJobForResponse(job, false);
    });
    
    res.json({
      success: true,
      data: formattedJobs
    });
  } catch (error) {
    console.error('❌ Get jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

const getJobById = async (req, res) => {
  try {
    console.log('🔍 Fetching job by ID:', req.params.id);
    const job = await Job.findById(req.params.id)
      .populate('company', 'name logo description contactEmail phoneNumber website')
      .lean();
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    const formattedJob = formatJobForResponse(job, false);
    
    console.log('✅ Job found:', formattedJob.title);
    res.json({
      success: true,
      data: formattedJob
    });
  } catch (error) {
    console.error('❌ Get job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
};

const createJob = async (req, res) => {
  try {
    console.log('🔧 Creating new job:', req.body.title);
    
    if (req.body.company) {
      const company = await Company.findById(req.body.company);
      if (!company) {
        return res.status(400).json({
          success: false,
          message: 'Company not found'
        });
      }
    }
    
    const jobData = {
      ...req.body,
      requirements: Array.isArray(req.body.requirements) ? req.body.requirements : [],
      responsibilities: Array.isArray(req.body.responsibilities) ? req.body.responsibilities : [],
      benefits: Array.isArray(req.body.benefits) ? req.body.benefits : []
    };
    
    const job = new Job(jobData);
    await job.save();
    
    await job.populate('company', 'name logo description contactEmail phoneNumber website');
    
    console.log('✅ Job created successfully:', job._id);
    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: {
        ...job.toObject(),
        id: job._id
      }
    });
  } catch (error) {
    console.error('❌ Create job error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create job',
      error: error.message
    });
  }
};

const updateJob = async (req, res) => {
  try {
    console.log('🔧 Updating job:', req.params.id);
    
    const updateData = {
      ...req.body,
      requirements: Array.isArray(req.body.requirements) ? req.body.requirements : [],
      responsibilities: Array.isArray(req.body.responsibilities) ? req.body.responsibilities : [],
      benefits: Array.isArray(req.body.benefits) ? req.body.benefits : []
    };
    
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('company', 'name logo description contactEmail phoneNumber website');
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    console.log('✅ Job updated successfully:', job._id);
    res.json({
      success: true,
      message: 'Job updated successfully',
      data: {
        ...job.toObject(),
        id: job._id
      }
    });
  } catch (error) {
    console.error('❌ Update job error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update job',
      error: error.message
    });
  }
};

const deleteJob = async (req, res) => {
  try {
    console.log('🗑️ Deleting job:', req.params.id);
    const job = await Job.findByIdAndDelete(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }
    
    console.log('✅ Job deleted successfully:', req.params.id);
    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete job error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message
    });
  }
};

module.exports = {
  getAllPublicJobs,
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
};
