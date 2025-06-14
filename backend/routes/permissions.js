
const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { permissionsMiddleware } = require('../middleware/permissions');
const { auditMiddleware } = require('../middleware/auditMiddleware');
const User = require('../models/User');
const router = express.Router();

// Default role permissions
const defaultRolePermissions = {
  admin: {
    users: { create: true, read: true, update: true, delete: true },
    companies: { create: true, read: true, update: true, delete: true },
    jobs: { create: true, read: true, update: true, delete: true },
    applications: { create: true, read: true, update: true, delete: true }
  },
  hr_manager: {
    users: { create: true, read: true, update: true, delete: false },
    companies: { create: true, read: true, update: true, delete: false },
    jobs: { create: true, read: true, update: true, delete: true },
    applications: { create: false, read: true, update: true, delete: false }
  },
  recruiter: {
    users: { create: false, read: true, update: false, delete: false },
    companies: { create: false, read: true, update: false, delete: false },
    jobs: { create: true, read: true, update: true, delete: false },
    applications: { create: false, read: true, update: true, delete: false }
  },
  viewer: {
    users: { create: false, read: true, update: false, delete: false },
    companies: { create: false, read: true, update: false, delete: false },
    jobs: { create: false, read: true, update: false, delete: false },
    applications: { create: false, read: true, update: false, delete: false }
  }
};

// Get role permissions
router.get('/roles', 
  authMiddleware,
  permissionsMiddleware('users', 'read'),
  auditMiddleware('view', 'permissions'),
  async (req, res) => {
    try {
      res.json({
        success: true,
        data: defaultRolePermissions
      });
    } catch (error) {
      console.error('Get role permissions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch role permissions'
      });
    }
  }
);

// Update role permissions (for future implementation)
router.put('/roles', 
  authMiddleware,
  permissionsMiddleware('users', 'update'),
  auditMiddleware('update', 'permissions'),
  async (req, res) => {
    try {
      // For now, just return success as we're using hardcoded permissions
      // In a full implementation, you'd store these in a database
      res.json({
        success: true,
        message: 'Role permissions updated successfully (demo mode)',
        data: req.body
      });
    } catch (error) {
      console.error('Update role permissions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update role permissions'
      });
    }
  }
);

// Update user specific permissions
router.put('/users/:userId', 
  authMiddleware,
  permissionsMiddleware('users', 'update'),
  auditMiddleware('update', 'user-permissions'),
  async (req, res) => {
    try {
      const { permissions } = req.body;
      
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { permissions },
        { new: true, runValidators: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.json({
        success: true,
        message: 'User permissions updated successfully',
        data: user
      });
    } catch (error) {
      console.error('Update user permissions error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update user permissions'
      });
    }
  }
);

module.exports = router;
