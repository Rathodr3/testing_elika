const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Store for reset tokens (in production, use Redis or database)
const resetTokens = new Map();

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
        user: { email, role: 'admin', firstName: 'Admin', lastName: 'User' }
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

// Enhanced change password endpoint with proper admin handling
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
    
    console.log('Password change request with token:', token.substring(0, 20) + '...');
    
    // Handle admin token
    if (token.startsWith('admin-token-')) {
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      
      if (currentPassword !== adminPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      
      // Update the environment variable for admin password
      // In production, this would be handled differently
      process.env.ADMIN_PASSWORD = newPassword;
      console.log('Admin password updated successfully');
      
      return res.json({
        success: true,
        message: 'Admin password changed successfully'
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

// Enhanced forgot password endpoint
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@elikaengineering.com';
    
    // Check if it's admin email
    if (email === adminEmail) {
      const resetToken = 'reset-token-admin-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
      
      // Store the reset token with expiry (30 minutes)
      resetTokens.set(resetToken, {
        email: adminEmail,
        type: 'admin',
        expires: Date.now() + (30 * 60 * 1000) // 30 minutes
      });
      
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
    const resetToken = 'reset-token-user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    // Store the reset token with user ID and expiry
    resetTokens.set(resetToken, {
      userId: user._id.toString(),
      email: user.email,
      type: 'user',
      expires: Date.now() + (30 * 60 * 1000) // 30 minutes
    });
    
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

// Enhanced reset password endpoint
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    
    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required'
      });
    }
    
    // Check if token exists and is valid
    const tokenData = resetTokens.get(resetToken);
    if (!tokenData) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    // Check if token has expired
    if (Date.now() > tokenData.expires) {
      resetTokens.delete(resetToken);
      return res.status(400).json({
        success: false,
        message: 'Reset token has expired'
      });
    }
    
    // Handle admin reset
    if (tokenData.type === 'admin') {
      console.log('Admin password reset with token:', resetToken);
      console.log('Updating admin password to:', newPassword);
      
      // Update the environment variable for admin password
      // Note: This only works for the current process. In production, 
      // you'd want to update a secure configuration store
      process.env.ADMIN_PASSWORD = newPassword;
      
      // Remove the used token
      resetTokens.delete(resetToken);
      
      console.log('Admin password updated successfully');
      
      return res.json({
        success: true,
        message: 'Admin password reset successfully'
      });
    }
    
    // Handle user reset
    if (tokenData.type === 'user') {
      const user = await User.findById(tokenData.userId);
      if (!user) {
        resetTokens.delete(resetToken);
        return res.status(400).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Hash and update password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      await User.findByIdAndUpdate(tokenData.userId, { 
        password: hashedPassword,
        updatedAt: new Date()
      });
      
      // Remove the used token
      resetTokens.delete(resetToken);
      
      console.log('User password reset successfully for:', user.email);
      
      return res.json({
        success: true,
        message: 'Password reset successfully'
      });
    }
    
    return res.status(400).json({
      success: false,
      message: 'Invalid token type'
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
});

// Add endpoint to validate reset tokens
router.post('/validate-reset-token', async (req, res) => {
  try {
    const { resetToken } = req.body;
    
    const tokenData = resetTokens.get(resetToken);
    if (!tokenData || Date.now() > tokenData.expires) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    res.json({
      success: true,
      message: 'Token is valid',
      email: tokenData.email
    });
    
  } catch (error) {
    console.error('Validate reset token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate token'
    });
  }
});

module.exports = router;
