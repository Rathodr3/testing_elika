
const permissionsMiddleware = (resource, action) => {
  return (req, res, next) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Admin has full access to everything
    if (user.role === 'admin') {
      console.log(`✅ Admin access granted for user ${user.email}: ${action} on ${resource}`);
      return next();
    }

    // Define role-based permissions
    const rolePermissions = {
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

    // Get user permissions (use custom permissions if set, otherwise use role-based)
    const userPermissions = user.permissions || rolePermissions[user.role] || rolePermissions.viewer;
    
    // Check if user has required permission
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
