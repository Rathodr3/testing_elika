
const AuditLog = require('../models/AuditLog');

const auditMiddleware = (action, resource) => {
  return async (req, res, next) => {
    // Store original res.json to intercept response
    const originalJson = res.json;
    
    res.json = function(data) {
      // Call original json method
      const result = originalJson.call(this, data);
      
      // Log audit activity asynchronously
      if (req.user && res.statusCode < 400) {
        setImmediate(async () => {
          try {
            const auditData = {
              userId: req.user.id || req.user._id || 'unknown',
              userEmail: req.user.email,
              userName: `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email,
              action,
              resource,
              resourceId: req.params.id || req.body._id || req.body.id,
              resourceName: req.body.name || req.body.title || req.body.email,
              ipAddress: req.ip || req.connection.remoteAddress,
              userAgent: req.get('User-Agent'),
              details: `${action} ${resource}${req.params.id ? ` (ID: ${req.params.id})` : ''}`
            };

            // Add changes for update operations
            if (action === 'update' && req.body) {
              auditData.changes = Object.keys(req.body).map(field => ({
                field,
                newValue: req.body[field],
                oldValue: 'N/A' // We don't have old values in this simple implementation
              }));
            }

            await AuditLog.create(auditData);
            console.log('✅ Audit log created for:', action, resource);
          } catch (error) {
            console.error('❌ Failed to create audit log:', error);
          }
        });
      }
      
      return result;
    };
    
    next();
  };
};

module.exports = { auditMiddleware };
