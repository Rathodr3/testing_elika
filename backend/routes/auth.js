
const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const {
  authenticateUser,
  changePassword,
  generateResetToken,
  resetPassword,
  validateResetToken,
  getRolePermissions
} = require('../services/authService');

const router = express.Router();

// Get current user info
router.get('/me', authMiddleware, async (req, res) => {
  try {
    console.log('Getting current user info for:', req.user.email);
    
    const userWithPermissions = {
      ...req.user,
      permissions: req.user.permissions || getRolePermissions(req.user.role)
    };

    res.json({
      success: true,
      user: userWithPermissions
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user info'
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email, password: '***' });
    
    const { token, user } = await authenticateUser(email, password);
    
    res.json({
      success: true,
      token,
      user,
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      message: error.message || 'Login failed'
    });
  }
});

// Change password endpoint
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
    
    const message = await changePassword(token, currentPassword, newPassword);
    
    res.json({
      success: true,
      message
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to change password'
    });
  }
});

// Forgot password endpoint
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const resetToken = await generateResetToken(email);
    
    console.log('Password reset requested for:', email);
    console.log('Reset token (would be sent via email):', resetToken);
    
    res.json({
      success: true,
      message: 'Password reset instructions sent to your email',
      resetToken // In production, don't return this - send via email
    });
    
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to process forgot password request'
    });
  }
});

// Reset password endpoint
router.post('/reset-password', async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    
    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required'
      });
    }
    
    const message = await resetPassword(resetToken, newPassword);
    
    res.json({
      success: true,
      message
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to reset password'
    });
  }
});

// Validate reset token endpoint
router.post('/validate-reset-token', async (req, res) => {
  try {
    const { resetToken } = req.body;
    
    const tokenData = validateResetToken(resetToken);
    if (!tokenData) {
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
