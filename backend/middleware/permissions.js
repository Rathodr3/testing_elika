
const permissionsMiddleware = (resource, action) => {
  return (req, res, next) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Admin has full access
    if (user.role === 'admin') {
      return next();
    }

    // Check if user has required permission
    const userPermissions = user.permissions;
    if (!userPermissions || !userPermissions[resource] || !userPermissions[resource][action]) {
      console.log(`❌ Permission denied for user ${user.email}: ${action} on ${resource}`);
      console.log('User role:', user.role);
      console.log('User permissions:', JSON.stringify(userPermissions, null, 2));
      
      return res.status(403).json({
        success: false,
        message: `Insufficient permissions. Required: ${action} on ${resource}`,
        details: `Your role '${user.role}' does not have permission to ${action} ${resource}`
      });
    }

    console.log(`✅ Permission granted for user ${user.email}: ${action} on ${resource}`);
    next();
  };
};

module.exports = { permissionsMiddleware };
