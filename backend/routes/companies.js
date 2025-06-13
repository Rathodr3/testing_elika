
const express = require('express');
const Company = require('../models/Company');
const { authMiddleware } = require('../middleware/auth');
const { permissionsMiddleware } = require('../middleware/permissions');
const { auditMiddleware } = require('../middleware/auditMiddleware');
const router = express.Router();

// Get all companies
router.get('/', 
  authMiddleware,
  permissionsMiddleware('companies', 'read'),
  auditMiddleware('view', 'companies'),
  async (req, res) => {
    try {
      const companies = await Company.find()
        .sort({ createdAt: -1 });
      
      res.json({
        success: true,
        data: companies
      });
    } catch (error) {
      console.error('Get companies error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch companies'
      });
    }
  }
);

// Create new company
router.post('/', 
  authMiddleware,
  permissionsMiddleware('companies', 'create'),
  auditMiddleware('create', 'companies'),
  async (req, res) => {
    try {
      const company = new Company(req.body);
      await company.save();
      
      res.status(201).json({
        success: true,
        message: 'Company created successfully',
        data: company
      });
    } catch (error) {
      console.error('Create company error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create company'
      });
    }
  }
);

// Update company
router.put('/:id', 
  authMiddleware,
  permissionsMiddleware('companies', 'update'),
  auditMiddleware('update', 'companies'),
  async (req, res) => {
    try {
      const company = await Company.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Company updated successfully',
        data: company
      });
    } catch (error) {
      console.error('Update company error:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update company'
      });
    }
  }
);

// Delete company
router.delete('/:id', 
  authMiddleware,
  permissionsMiddleware('companies', 'delete'),
  auditMiddleware('delete', 'companies'),
  async (req, res) => {
    try {
      const company = await Company.findByIdAndDelete(req.params.id);
      
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Company deleted successfully'
      });
    } catch (error) {
      console.error('Delete company error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete company'
      });
    }
  }
);

module.exports = router;
