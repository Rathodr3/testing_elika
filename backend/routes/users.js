
const express = require('express');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');
const { permissionsMiddleware } = require('../middleware/permissions');
const { auditMiddleware } = require('../middleware/auditMiddleware');
const router = express.Router();

// Get all users
router.get('/', 
  authMiddleware,
  permissionsMiddleware('users', 'read'),
  auditMiddleware('view', 'users'),
  async (req, res) => {
    try {
      const users = await User.find()
        .select('-password')
        .sort({ createdAt: -1 });
      
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch users'
      });
    }
  }
);

// Create new user
router.post('/', 
  authMiddleware,
  permissionsMiddleware('users', 'create'),
  auditMiddleware('create', 'users'),
  async (req, res) => {
    try {
      const { firstName, lastName, email, phoneNumber, employeeId, photo, role, password } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Check if employee ID already exists (if provided)
      if (employeeId) {
        const existingEmployeeId = await User.findOne({ employeeId });
        if (existingEmployeeId) {
          return res.status(400).json({
            success: false,
            message: 'Employee ID already exists'
          });
        }
      }
      
      // Create user - let the model handle password hashing
      const user = new User({
        firstName,
        lastName,
        email,
        phoneNumber,
        employeeId,
        photo,
        role,
        password // Don't hash here, let the pre-save middleware handle it
      });
      
      await user.save();
      
      // Return user without password
      const userResponse = user.toObject();
      delete userResponse.password;
      
      console.log('User created successfully:', userResponse.email);
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: userResponse
      });
    } catch (error) {
      console.error('Create user error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create user'
      });
    }
  }
);

// Update user
router.put('/:id', 
  authMiddleware,
  permissionsMiddleware('users', 'update'),
  auditMiddleware('update', 'users'),
  async (req, res) => {
    try {
      const { password, ...updateData } = req.body;
      
      // If employee ID is being updated, check for duplicates
      if (updateData.employeeId) {
        const existingEmployeeId = await User.findOne({ 
          employeeId: updateData.employeeId,
          _id: { $ne: req.params.id }
        });
        if (existingEmployeeId) {
          return res.status(400).json({
            success: false,
            message: 'Employee ID already exists'
          });
        }
      }
      
      // If password is being updated, include it in updateData and let pre-save handle hashing
      if (password) {
        updateData.password = password;
        console.log('Password will be updated for user:', req.params.id);
      }
      
      const user = await User.findByIdAndUpdate(
        req.params.id,
        updateData,
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
        message: 'User updated successfully',
        data: user
      });
    } catch (error) {
      console.error('Update user error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update user'
      });
    }
  }
);

// Delete user
router.delete('/:id', 
  authMiddleware,
  permissionsMiddleware('users', 'delete'),
  auditMiddleware('delete', 'users'),
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete user'
      });
    }
  }
);

module.exports = router;
