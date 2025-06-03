
const Joi = require('joi');

const jobApplicationSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).required().messages({
    'string.empty': 'First name is required',
    'string.max': 'First name cannot exceed 50 characters'
  }),
  lastName: Joi.string().min(1).max(50).required().messages({
    'string.empty': 'Last name is required',
    'string.max': 'Last name cannot exceed 50 characters'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'string.empty': 'Email is required'
  }),
  phone: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).required().messages({
    'string.pattern.base': 'Please enter a valid phone number',
    'string.empty': 'Phone number is required'
  }),
  position: Joi.string().min(1).required().messages({
    'string.empty': 'Position is required'
  }),
  department: Joi.string().valid('Engineering', 'Consulting', 'Training', 'Software Development', 'Management').required().messages({
    'any.only': 'Please select a valid department',
    'string.empty': 'Department is required'
  }),
  experienceLevel: Joi.string().valid('Entry Level', 'Mid Level', 'Senior Level', 'Executive').required().messages({
    'any.only': 'Please select a valid experience level',
    'string.empty': 'Experience level is required'
  }),
  yearsOfExperience: Joi.number().integer().min(0).max(50).required().messages({
    'number.base': 'Years of experience must be a number',
    'number.min': 'Years of experience cannot be negative',
    'number.max': 'Years of experience cannot exceed 50',
    'any.required': 'Years of experience is required'
  }),
  skills: Joi.string().allow('').optional(),
  previousCompany: Joi.string().allow('').optional(),
  coverLetter: Joi.string().max(2000).allow('').optional().messages({
    'string.max': 'Cover letter cannot exceed 2000 characters'
  })
});

const validateJobApplication = (req, res, next) => {
  const { error } = jobApplicationSchema.validate(req.body);
  
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }
  
  next();
};

module.exports = {
  validateJobApplication
};
