
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Define role-based permissions
const rolePermissions = {
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

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    console.log('🔍 Auth Header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid authorization header found');
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('🔍 Processing token type:', token.substring(0, 10) + '...');

    // Handle hardcoded admin token for backwards compatibility
    if (token.startsWith('admin-token-')) {
      console.log('🔑 Processing admin token');
      req.user = {
        id: 'admin',
        _id: 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@elikaengineering.com',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        permissions: rolePermissions.admin,
        isActive: true
      };
      console.log('✅ Admin token authenticated successfully');
      return next();
    }

    // Handle user tokens (user-token-{userId} format)
    if (token.startsWith('user-token-')) {
      console.log('🔑 Processing user token');
      const tokenParts = token.split('-');
      const userId = tokenParts[tokenParts.length - 1];
      
      console.log('🔍 Looking up user ID:', userId);
      const user = await User.findById(userId).select('-password');
      if (!user) {
        console.log('❌ User not found for token');
        return res.status(401).json({
          success: false,
          message: 'Invalid token. User not found.'
        });
      }

      if (!user.isActive) {
        console.log('❌ User account is deactivated');
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated.'
        });
      }

      // Set permissions: use custom permissions if available, otherwise use role-based
      let userPermissions;
      if (user.permissions && Object.keys(user.permissions).length > 0) {
        // Check if permissions have the correct structure
        const hasValidStructure = ['users', 'companies', 'jobs', 'applications'].every(resource => 
          user.permissions[resource] && 
          typeof user.permissions[resource] === 'object' &&
          ['create', 'read', 'update', 'delete'].every(action => 
            typeof user.permissions[resource][action] === 'boolean'
          )
        );
        
        if (hasValidStructure) {
          userPermissions = user.permissions;
          console.log('🔑 Using valid custom user permissions');
        } else {
          userPermissions = rolePermissions[user.role] || rolePermissions.viewer;
          console.log('🔑 Custom permissions invalid, using role-based permissions for:', user.role);
        }
      } else {
        userPermissions = rolePermissions[user.role] || rolePermissions.viewer;
        console.log('🔑 Using role-based permissions for:', user.role);
      }
      
      req.user = {
        id: user._id.toString(),
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        permissions: userPermissions,
        isActive: user.isActive
      };
      
      console.log(`✅ User token authenticated: ${user.email} (${user.role})`);
      console.log('🔑 Final user permissions:', JSON.stringify(userPermissions, null, 2));
      return next();
    }

    // Try to verify as JWT token
    try {
      console.log('🔑 Processing JWT token');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        console.log('❌ User not found for JWT');
        return res.status(401).json({
          success: false,
          message: 'Invalid token. User not found.'
        });
      }

      if (!user.isActive) {
        console.log('❌ User account is deactivated (JWT)');
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated.'
        });
      }

      // Set permissions: use custom permissions if available, otherwise use role-based
      let userPermissions;
      if (user.permissions && Object.keys(user.permissions).length > 0) {
        // Check if permissions have the correct structure
        const hasValidStructure = ['users', 'companies', 'jobs', 'applications'].every(resource => 
          user.permissions[resource] && 
          typeof user.permissions[resource] === 'object' &&
          ['create', 'read', 'update', 'delete'].every(action => 
            typeof user.permissions[resource][action] === 'boolean'
          )
        );
        
        if (hasValidStructure) {
          userPermissions = user.permissions;
          console.log('🔑 Using valid custom user permissions (JWT)');
        } else {
          userPermissions = rolePermissions[user.role] || rolePermissions.viewer;
          console.log('🔑 Custom permissions invalid, using role-based permissions for (JWT):', user.role);
        }
      } else {
        userPermissions = rolePermissions[user.role] || rolePermissions.viewer;
        console.log('🔑 Using role-based permissions for (JWT):', user.role);
      }

      req.user = {
        id: user._id.toString(),
        _id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        permissions: userPermissions,
        isActive: user.isActive
      };
      
      console.log(`✅ JWT token authenticated: ${user.email} (${user.role})`);
      console.log('🔑 Final user permissions (JWT):', JSON.stringify(userPermissions, null, 2));
      next();
    } catch (jwtError) {
      console.error('❌ JWT verification failed:', jwtError.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

const adminMiddleware = (req, res, next) => {
  console.log('🔍 Admin middleware check');
  if (!req.user) {
    console.log('❌ No user in request');
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  console.log('🔍 User role:', req.user.role);
  if (req.user.role !== 'admin' && req.user.role !== 'hr_manager') {
    console.log('❌ Insufficient admin privileges');
    return res.status(403).json({
      success: false,
      message: 'Admin access required.'
    });
  }

  console.log('✅ Admin access granted');
  next();
};

module.exports = { authMiddleware, adminMiddleware };
