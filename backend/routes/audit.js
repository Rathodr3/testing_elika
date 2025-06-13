
const express = require('express');
const AuditLog = require('../models/AuditLog');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Middleware to check admin access for audit logs
const adminOnlyMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required for audit logs'
    });
  }
  next();
};

// Get audit logs (admin only)
router.get('/', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const {
      userId,
      resource,
      action,
      startDate,
      endDate,
      page = 1,
      limit = 50
    } = req.query;

    console.log('🔍 Fetching audit logs with filters:', req.query);

    // Build filter object
    const filter = {};
    
    if (userId) filter.userEmail = { $regex: userId, $options: 'i' };
    if (resource) filter.resource = resource;
    if (action) filter.action = action;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate + 'T23:59:59.999Z');
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      AuditLog.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    console.log(`✅ Found ${logs.length} audit logs (${total} total)`);

    res.json({
      success: true,
      data: {
        logs: logs.map(log => ({
          ...log,
          timestamp: log.createdAt
        })),
        total,
        page: parseInt(page),
        totalPages,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('❌ Get audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: error.message
    });
  }
});

// Create audit log
router.post('/', authMiddleware, async (req, res) => {
  try {
    const auditData = {
      ...req.body,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    };

    const auditLog = new AuditLog(auditData);
    await auditLog.save();

    console.log('✅ Audit log created:', auditLog._id);
    res.status(201).json({
      success: true,
      message: 'Audit log created successfully'
    });
  } catch (error) {
    console.error('❌ Create audit log error:', error);
    // Don't fail the main request if audit logging fails
    res.status(200).json({
      success: false,
      message: 'Audit log creation failed but request proceeded',
      error: error.message
    });
  }
});

// Export audit logs as CSV (admin only)
router.get('/export', authMiddleware, adminOnlyMiddleware, async (req, res) => {
  try {
    const {
      userId,
      resource,
      action,
      startDate,
      endDate
    } = req.query;

    console.log('📥 Exporting audit logs with filters:', req.query);

    // Build filter object
    const filter = {};
    
    if (userId) filter.userEmail = { $regex: userId, $options: 'i' };
    if (resource) filter.resource = resource;
    if (action) filter.action = action;
    
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate + 'T23:59:59.999Z');
    }

    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    // Generate CSV content
    const csvHeaders = [
      'Timestamp',
      'User Email',
      'User Name',
      'Action',
      'Resource',
      'Resource Name',
      'Details',
      'IP Address',
      'Changes'
    ];

    const csvRows = logs.map(log => [
      log.createdAt.toISOString(),
      log.userEmail,
      log.userName,
      log.action,
      log.resource,
      log.resourceName || '',
      log.details || '',
      log.ipAddress || '',
      log.changes ? log.changes.map(c => `${c.field}: ${c.oldValue} → ${c.newValue}`).join('; ') : ''
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    console.log(`✅ Exported ${logs.length} audit logs`);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');
    res.send(csvContent);
  } catch (error) {
    console.error('❌ Export audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export audit logs',
      error: error.message
    });
  }
});

module.exports = router;
