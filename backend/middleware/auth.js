
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
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Handle hardcoded admin token for backwards compatibility
    if (token.startsWith('admin-token-')) {
      req.user = {
        id: 'admin',
        email: process.env.ADMIN_EMAIL || 'admin@elikaengineering.com',
        role: 'admin',
        firstName: 'Admin',
        lastName: 'User',
        permissions: rolePermissions.admin
      };
      console.log('✅ Admin token authenticated');
      return next();
    }

    // Handle user tokens
    if (token.startsWith('user-token-')) {
      const tokenParts = token.split('-');
      const userId = tokenParts[tokenParts.length - 1];
      
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. User not found.'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated.'
        });
      }

      // Set permissions based on role
      const userPermissions = user.permissions || rolePermissions[user.role] || rolePermissions.viewer;
      
      req.user = {
        ...user.toObject(),
        permissions: userPermissions
      };
      
      console.log(`✅ User token authenticated: ${user.email} (${user.role})`);
      console.log('User permissions:', JSON.stringify(userPermissions, null, 2));
      return next();
    }

    // Try to verify as JWT token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. User not found.'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated.'
        });
      }

      // Set permissions based on role
      const userPermissions = user.permissions || rolePermissions[user.role] || rolePermissions.viewer;

      req.user = {
        ...user.toObject(),
        permissions: userPermissions
      };
      
      console.log(`✅ JWT token authenticated: ${user.email} (${user.role})`);
      console.log('User permissions:', JSON.stringify(userPermissions, null, 2));
      next();
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed.'
    });
  }
};

const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }

  if (req.user.role !== 'admin' && req.user.role !== 'hr_manager') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required.'
    });
  }

  next();
};

module.exports = { authMiddleware, adminMiddleware };
