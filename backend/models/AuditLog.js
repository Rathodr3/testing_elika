
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  action: {
    type: String,
    enum: ['create', 'update', 'delete', 'view', 'login', 'logout'],
    required: true
  },
  resource: {
    type: String,
    enum: ['users', 'companies', 'jobs', 'applications'],
    required: true
  },
  resourceId: {
    type: String
  },
  resourceName: {
    type: String
  },
  changes: [{
    field: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    _id: false
  }],
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  details: {
    type: String
  }
}, {
  timestamps: true
});

// Index for better query performance
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ resource: 1, action: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
