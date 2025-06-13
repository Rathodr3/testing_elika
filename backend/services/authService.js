
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Store for reset tokens (in production, use Redis or database)
const resetTokens = new Map();

const getRolePermissions = (role) => {
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

  return rolePermissions[role] || rolePermissions.viewer;
};

const authenticateUser = async (email, password) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@elikaengineering.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  // Check hardcoded admin
  if (email === adminEmail && password === adminPassword) {
    const token = 'admin-token-' + Date.now();
    
    const adminUser = {
      email,
      role: 'admin',
      firstName: 'Admin',
      lastName: 'User',
      permissions: getRolePermissions('admin')
    };
    
    return { token, user: adminUser };
  }
  
  // Check database user
  const user = await User.findOne({ email });
  if (!user || !user.isActive) {
    throw new Error('Invalid credentials');
  }
  
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }
  
  const token = 'user-token-' + Date.now() + '-' + user._id;
  
  const userResponse = {
    id: user._id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    permissions: user.permissions || getRolePermissions(user.role)
  };
  
  return { token, user: userResponse };
};

const changePassword = async (token, currentPassword, newPassword) => {
  if (token.startsWith('admin-token-')) {
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (currentPassword !== adminPassword) {
      throw new Error('Current password is incorrect');
    }
    
    process.env.ADMIN_PASSWORD = newPassword;
    return 'Admin password changed successfully';
  }
  
  if (token.startsWith('user-token-')) {
    const tokenParts = token.split('-');
    const userId = tokenParts[tokenParts.length - 1];
    
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await User.findByIdAndUpdate(userId, { password: hashedPassword });
    
    return 'Password changed successfully';
  }
  
  throw new Error('Invalid token');
};

const generateResetToken = async (email) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@elikaengineering.com';
  
  if (email === adminEmail) {
    const resetToken = 'reset-token-admin-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    resetTokens.set(resetToken, {
      email: adminEmail,
      type: 'admin',
      expires: Date.now() + (30 * 60 * 1000)
    });
    
    return resetToken;
  }
  
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Email not found');
  }
  
  const resetToken = 'reset-token-user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  
  resetTokens.set(resetToken, {
    userId: user._id.toString(),
    email: user.email,
    type: 'user',
    expires: Date.now() + (30 * 60 * 1000)
  });
  
  return resetToken;
};

const resetPassword = async (resetToken, newPassword) => {
  const tokenData = resetTokens.get(resetToken);
  if (!tokenData || Date.now() > tokenData.expires) {
    resetTokens.delete(resetToken);
    throw new Error('Invalid or expired reset token');
  }
  
  if (tokenData.type === 'admin') {
    process.env.ADMIN_PASSWORD = newPassword;
    resetTokens.delete(resetToken);
    return 'Admin password reset successfully';
  }
  
  if (tokenData.type === 'user') {
    const user = await User.findById(tokenData.userId);
    if (!user) {
      resetTokens.delete(resetToken);
      throw new Error('User not found');
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await User.findByIdAndUpdate(tokenData.userId, { 
      password: hashedPassword,
      updatedAt: new Date()
    });
    
    resetTokens.delete(resetToken);
    return 'Password reset successfully';
  }
  
  throw new Error('Invalid token type');
};

const validateResetToken = (resetToken) => {
  const tokenData = resetTokens.get(resetToken);
  if (!tokenData || Date.now() > tokenData.expires) {
    return null;
  }
  return tokenData;
};

module.exports = {
  authenticateUser,
  changePassword,
  generateResetToken,
  resetPassword,
  validateResetToken,
  getRolePermissions
};
