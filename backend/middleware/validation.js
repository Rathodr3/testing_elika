const validateJobApplication = (req, res, next) => {
  const { firstName, lastName, email, phone, position, department, experienceLevel, yearsOfExperience } = req.body;
  const errors = [];

  // Validate required fields
  if (!firstName || typeof firstName !== 'string' || firstName.trim().length < 2) {
    errors.push('First name is required and must be at least 2 characters');
  }

  if (!lastName || typeof lastName !== 'string' || lastName.trim().length < 2) {
    errors.push('Last name is required and must be at least 2 characters');
  }

  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please provide a valid email address');
    }
  }

  if (!phone || typeof phone !== 'string' || !/^\d+$/.test(phone)) {
    errors.push('Phone number is required and must contain only digits');
  }

  if (!position || typeof position !== 'string' || position.trim().length < 2) {
    errors.push('Position is required and must be at least 2 characters');
  }

  if (!department || typeof department !== 'string') {
    errors.push('Department is required');
  }

  if (!experienceLevel || typeof experienceLevel !== 'string') {
    errors.push('Experience Level is required');
  }

  if (!yearsOfExperience || isNaN(parseInt(yearsOfExperience))) {
    errors.push('Years of Experience is required and must be a number');
  }

  // Validate field lengths
  if (firstName && firstName.length > 50) {
    errors.push('First name must be less than 50 characters');
  }

  if (lastName && lastName.length > 50) {
    errors.push('Last name must be less than 50 characters');
  }

  if (position && position.length > 100) {
    errors.push('Position must be less than 100 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

// Validate contact form data
const validateContactForm = (req, res, next) => {
  const { name, email, subject, message } = req.body;
  const errors = [];

  // Validate required fields
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }

  if (!email || typeof email !== 'string') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please provide a valid email address');
    }
  }

  if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
    errors.push('Subject is required and must be at least 3 characters');
  }

  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.push('Message is required and must be at least 10 characters');
  }

  // Validate field lengths
  if (name && name.length > 100) {
    errors.push('Name must be less than 100 characters');
  }

  if (subject && subject.length > 200) {
    errors.push('Subject must be less than 200 characters');
  }

  if (message && message.length > 2000) {
    errors.push('Message must be less than 2000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

module.exports = {
  validateJobApplication,
  validateContactForm
};
