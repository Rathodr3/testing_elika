const nodemailer = require('nodemailer');
const path = require('path');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email notification to admin when new application is received
const sendApplicationEmail = async (application, resumeFile) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Job Application - ${application.position}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            New Job Application Received
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Applicant Information</h3>
            <p><strong>Name:</strong> ${application.firstName} ${application.lastName}</p>
            <p><strong>Email:</strong> ${application.email}</p>
            <p><strong>Phone:</strong> ${application.phone}</p>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Position Details</h3>
            <p><strong>Position:</strong> ${application.position}</p>
            <p><strong>Department:</strong> ${application.department}</p>
            <p><strong>Experience Level:</strong> ${application.experienceLevel}</p>
            <p><strong>Years of Experience:</strong> ${application.yearsOfExperience}</p>
            ${application.previousCompany ? `<p><strong>Previous Company:</strong> ${application.previousCompany}</p>` : ''}
            ${application.skills.length > 0 ? `<p><strong>Skills:</strong> ${application.skills.join(', ')}</p>` : ''}
          </div>
          
          ${application.coverLetter ? `
          <div style="background-color: #fefce8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Cover Letter</h3>
            <p style="white-space: pre-wrap;">${application.coverLetter}</p>
          </div>
          ` : ''}
          
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Application Date:</strong> ${new Date(application.applicationDate).toLocaleDateString()}</p>
            <p><strong>Application ID:</strong> ${application._id}</p>
            ${resumeFile ? `<p><strong>Resume:</strong> ${resumeFile.originalname} (attached)</p>` : '<p><strong>Resume:</strong> Not provided</p>'}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280;">Please log in to the admin portal to review and manage this application.</p>
          </div>
        </div>
      `,
      attachments: resumeFile ? [{
        filename: resumeFile.originalname,
        path: resumeFile.path
      }] : []
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent:', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending admin notification email:', error);
    throw error;
  }
};

// Send confirmation email to applicant
const sendConfirmationEmail = async (application) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: application.email,
      subject: 'Application Received - Elika Engineering',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Elika Engineering</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for your application!</p>
          </div>
          
          <div style="padding: 30px; background-color: #ffffff; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <h2 style="color: #1e293b; margin-top: 0;">Dear ${application.firstName},</h2>
            
            <p style="color: #374151; line-height: 1.6;">
              Thank you for your interest in the <strong>${application.position}</strong> position in our ${application.department} department. 
              We have successfully received your application and our team will review it carefully.
            </p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Application Summary</h3>
              <p><strong>Position:</strong> ${application.position}</p>
              <p><strong>Department:</strong> ${application.department}</p>
              <p><strong>Application ID:</strong> ${application._id}</p>
              <p><strong>Submitted:</strong> ${new Date(application.applicationDate).toLocaleDateString()}</p>
            </div>
            
            <p style="color: #374151; line-height: 1.6;">
              <strong>What happens next?</strong><br>
              • Our hiring team will review your application within 5-7 business days<br>
              • If your profile matches our requirements, we will contact you for the next steps<br>
              • You can expect to hear from us within 2 weeks
            </p>
            
            <p style="color: #374151; line-height: 1.6;">
              If you have any questions about your application or the position, please don't hesitate to contact us at 
              <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #3b82f6;">${process.env.ADMIN_EMAIL}</a>.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="padding: 20px; background-color: #ecfdf5; border-radius: 8px; border-left: 4px solid #10b981;">
                <p style="margin: 0; color: #065f46; font-weight: 500;">
                  We appreciate your interest in joining our team at Elika Engineering!
                </p>
              </div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              The Elika Engineering Team
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>© 2024 Elika Engineering Pvt. Ltd. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent:', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

// Send email notification to admin when contact form is submitted
const sendContactEmail = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission - ${contactData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            ${contactData.company ? `<p><strong>Company:</strong> ${contactData.company}</p>` : ''}
            <p><strong>Subject:</strong> ${contactData.subject}</p>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${contactData.message}</p>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Submitted:</strong> ${new Date(contactData.submittedAt).toLocaleString()}</p>
            <p><strong>Reply to:</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #6b7280;">Please respond to this inquiry promptly.</p>
          </div>
        </div>
      `,
      replyTo: contactData.email
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact form notification email sent:', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending contact form notification email:', error);
    throw error;
  }
};

// Send confirmation email to contact form submitter
const sendContactConfirmation = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: contactData.email,
      subject: 'Message Received - Elika Engineering',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Elika Engineering</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Thank you for contacting us!</p>
          </div>
          
          <div style="padding: 30px; background-color: #ffffff; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
            <h2 style="color: #1e293b; margin-top: 0;">Dear ${contactData.name},</h2>
            
            <p style="color: #374151; line-height: 1.6;">
              Thank you for reaching out to us. We have received your message regarding 
              "<strong>${contactData.subject}</strong>" and our team will review it promptly.
            </p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Your Message Summary</h3>
              <p><strong>Subject:</strong> ${contactData.subject}</p>
              <p><strong>Submitted:</strong> ${new Date(contactData.submittedAt).toLocaleString()}</p>
              ${contactData.company ? `<p><strong>Company:</strong> ${contactData.company}</p>` : ''}
            </div>
            
            <p style="color: #374151; line-height: 1.6;">
              <strong>What happens next?</strong><br>
              • Our team will review your message within 24 hours<br>
              • We will respond to your inquiry via email<br>
              • For urgent matters, please call us at (+91) 8149879640
            </p>
            
            <p style="color: #374151; line-height: 1.6;">
              If you have any additional questions, please don't hesitate to contact us at 
              <a href="mailto:${process.env.ADMIN_EMAIL}" style="color: #3b82f6;">${process.env.ADMIN_EMAIL}</a>.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="padding: 20px; background-color: #ecfdf5; border-radius: 8px; border-left: 4px solid #10b981;">
                <p style="margin: 0; color: #065f46; font-weight: 500;">
                  We appreciate your interest in Elika Engineering!
                </p>
              </div>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Best regards,<br>
              The Elika Engineering Team
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>© 2024 Elika Engineering Pvt. Ltd. All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Contact confirmation email sent:', info.messageId);
    return info;

  } catch (error) {
    console.error('Error sending contact confirmation email:', error);
    throw error;
  }
};

module.exports = {
  sendApplicationEmail,
  sendConfirmationEmail,
  sendContactEmail,
  sendContactConfirmation
};
