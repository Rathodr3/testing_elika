
const permissionsMiddleware = (resource, action) => {
  return (req, res, next) => {
    const user = req.user;
    
    console.log(`🔍 Permission check: ${action} on ${resource}`);
    console.log('User info:', user ? { 
      id: user.id || user._id, 
      email: user.email, 
      role: user.role,
      hasPermissions: !!user.permissions 
    } : 'None');
    
    if (!user) {
      console.log('❌ Permission denied: No user found');
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

    // Define role-based permissions (fallback if user.permissions is not set)
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
    let userPermissions;
    if (user.permissions && typeof user.permissions === 'object' && Object.keys(user.permissions).length > 0) {
      // Validate permission structure
      const hasValidStructure = ['users', 'companies', 'jobs', 'applications'].every(res => 
        user.permissions[res] && 
        typeof user.permissions[res] === 'object' &&
        ['create', 'read', 'update', 'delete'].every(act => 
          typeof user.permissions[res][act] === 'boolean'
        )
      );
      
      if (hasValidStructure) {
        console.log('📋 Using valid custom user permissions');
        userPermissions = user.permissions;
      } else {
        console.log(`📋 Custom permissions invalid, using role-based permissions for role: ${user.role}`);
        userPermissions = rolePermissions[user.role] || rolePermissions.viewer;
      }
    } else {
      console.log(`📋 Using role-based permissions for role: ${user.role}`);
      userPermissions = rolePermissions[user.role] || rolePermissions.viewer;
    }
    
    console.log('📋 Applied permissions for resource:', resource, JSON.stringify(userPermissions[resource] || {}, null, 2));
    
    // Check if user has required permission
    const resourcePermissions = userPermissions[resource];
    if (!resourcePermissions) {
      console.log(`❌ No permissions found for resource: ${resource}`);
      return res.status(403).json({
        success: false,
        message: `No access to resource: ${resource}`,
        details: {
          userRole: user.role,
          requiredPermission: `${resource}.${action}`,
          hasPermission: false,
          availableResources: Object.keys(userPermissions)
        }
      });
    }

    const hasPermission = resourcePermissions[action] === true;
    
    if (!hasPermission) {
      console.log(`❌ Permission denied for user ${user.email}: ${action} on ${resource}`);
      console.log('Required permission path:', `${resource}.${action}`);
      console.log('Permission value:', resourcePermissions[action]);
      console.log('Available permissions for resource:', JSON.stringify(resourcePermissions, null, 2));
      
      return res.status(403).json({
        success: false,
        message: `Insufficient permissions. Required: ${action} on ${resource}`,
        details: {
          userRole: user.role,
          requiredPermission: `${resource}.${action}`,
          hasPermission: false,
          actualPermission: resourcePermissions[action],
          availablePermissions: resourcePermissions
        }
      });
    }

    console.log(`✅ Permission granted for user ${user.email}: ${action} on ${resource}`);
    next();
  };
};

module.exports = { permissionsMiddleware };
