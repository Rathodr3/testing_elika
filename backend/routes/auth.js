
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Simple admin login with database user support
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email, password: '***' });
    
    // First check if it's the hardcoded admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@elikaengineering.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (email === adminEmail && password === adminPassword) {
      // In production, generate a proper JWT token
      const token = 'admin-token-' + Date.now();
      
      return res.json({
        success: true,
        token,
        user: { email, role: 'admin' }
      });
    }
    
    // Check database for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }
    
    // Compare password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate token for database user
    const token = 'user-token-' + Date.now() + '-' + user._id;
    
    res.json({
      success: true,
      token,
      user: { 
        id: user._id,
        email: user.email, 
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Change password endpoint - now supports both admin and database users
router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    // Handle admin token
    if (token.startsWith('admin-token-')) {
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      
      if (currentPassword !== adminPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      
      // In a real app, you would update the admin password in environment or database
      console.log('Admin password change request - New password would be:', newPassword);
      
      return res.json({
        success: true,
        message: 'Password changed successfully'
      });
    }
    
    // Handle user token
    if (token.startsWith('user-token-')) {
      const tokenParts = token.split('-');
      const userId = tokenParts[tokenParts.length - 1];
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      
      // Hash and update new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      await User.findByIdAndUpdate(userId, { password: hashedPassword });
      
      console.log('User password changed successfully for:', user.email);
      
      return res.json({
        success: true,
        message: 'Password changed successfully'
      });
    }
    
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
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
    
    // Check if it's admin email
    if (email === adminEmail) {
      const resetToken = 'reset-token-admin-' + Date.now();
      
      console.log('Admin password reset requested for:', email);
      console.log('Reset token (would be sent via email):', resetToken);
      
      return res.json({
        success: true,
        message: 'Password reset instructions sent to your email',
        resetToken // In production, don't return this - send via email
      });
    }
    
    // Check database for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email not found'
      });
    }
    
    // Generate reset token for database user
    const resetToken = 'reset-token-user-' + Date.now() + '-' + user._id;
    
    console.log('User password reset requested for:', email);
    console.log('Reset token (would be sent via email):', resetToken);
    
    res.json({
      success: true,
      message: 'Password reset instructions sent to your email',
      resetToken // In production, don't return this - send via email
    });
    
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
    
    if (!resetToken || !resetToken.startsWith('reset-token-')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    // Handle admin reset
    if (resetToken.includes('admin')) {
      console.log('Admin password reset with token:', resetToken);
      console.log('New admin password would be:', newPassword);
      
      return res.json({
        success: true,
        message: 'Password reset successfully'
      });
    }
    
    // Handle user reset
    if (resetToken.includes('user')) {
      const tokenParts = resetToken.split('-');
      const userId = tokenParts[tokenParts.length - 1];
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid reset token'
        });
      }
      
      // Hash and update password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      await User.findByIdAndUpdate(userId, { password: hashedPassword });
      
      console.log('User password reset successfully for:', user.email);
      
      return res.json({
        success: true,
        message: 'Password reset successfully'
      });
    }
    
    return res.status(400).json({
      success: false,
      message: 'Invalid reset token'
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
