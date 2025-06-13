
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
      return res.status(403).json({
        success: false,
        message: `Insufficient permissions. Required: ${action} on ${resource}`
      });
    }

    next();
  };
};

module.exports = { permissionsMiddleware };
