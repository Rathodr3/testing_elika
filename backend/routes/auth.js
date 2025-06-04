
const express = require('express');
const router = express.Router();

// Simple admin login (for demonstration - in production use proper authentication)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email, password: '***' });
    
    // Simple hardcoded admin check (replace with proper authentication)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@elikaengineering.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (email === adminEmail && password === adminPassword) {
      // In production, generate a proper JWT token
      const token = 'admin-token-' + Date.now();
      
      res.json({
        success: true,
        token,
        user: { email, role: 'admin' }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Change password endpoint
router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token || !token.startsWith('admin-token-')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (currentPassword !== adminPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // In a real app, you would update the password in the database
    // For demo purposes, we'll just return success
    console.log('Password change request - New password would be:', newPassword);
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// Forgot password endpoint
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@elikaengineering.com';
    
    if (email === adminEmail) {
      // In a real app, you would send a reset email
      // For demo purposes, we'll just return a reset token
      const resetToken = 'reset-token-' + Date.now();
      
      console.log('Password reset requested for:', email);
      console.log('Reset token (would be sent via email):', resetToken);
      
      res.json({
        success: true,
        message: 'Password reset instructions sent to your email',
        resetToken // In production, don't return this - send via email
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Email not found'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process forgot password request'
    });
  }
});

// Reset password endpoint
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    
    // Simple validation - in production, validate token properly
    if (!resetToken || !resetToken.startsWith('reset-token-')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    // In a real app, you would update the password in the database
    console.log('Password reset with token:', resetToken);
    console.log('New password would be:', newPassword);
    
    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
});

module.exports = router;
