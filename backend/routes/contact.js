
const express = require('express');
const { validateContactForm } = require('../middleware/validation');
const { sendContactEmail, sendContactConfirmation } = require('../services/emailService');

const router = express.Router();

// POST /api/contact - Submit contact form
router.post('/', validateContactForm, async (req, res) => {
  try {
    const contactData = {
      name: req.body.name,
      email: req.body.email,
      company: req.body.company,
      subject: req.body.subject,
      message: req.body.message,
      submittedAt: new Date()
    };

    console.log('Contact form submitted:', contactData);

    // Send email notifications to info@elikaengineering.com
    try {
      await sendContactEmail(contactData);
      await sendContactConfirmation(contactData);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the contact submission if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Message sent successfully. We will get back to you soon!'
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    
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
      message: 'Failed to send message. Please try again.'
    });
  }
});

module.exports = router;
