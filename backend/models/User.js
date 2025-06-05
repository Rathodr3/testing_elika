
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'hr_manager', 'recruiter', 'viewer'],
    default: 'viewer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  permissions: {
    users: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: false },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    companies: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: true },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    jobs: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: true },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    },
    applications: {
      create: { type: Boolean, default: false },
      read: { type: Boolean, default: true },
      update: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    }
  }
}, {
  timestamps: true
});

// Hash password before saving - Fix for new user login issue
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Also handle password hashing for findOneAndUpdate operations
userSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  
  if (update.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Set default permissions based on role
userSchema.pre('save', function(next) {
  if (this.role === 'admin') {
    this.permissions = {
      users: { create: true, read: true, update: true, delete: true },
      companies: { create: true, read: true, update: true, delete: true },
      jobs: { create: true, read: true, update: true, delete: true },
      applications: { create: true, read: true, update: true, delete: true }
    };
  } else if (this.role === 'hr_manager') {
    this.permissions = {
      users: { create: false, read: true, update: false, delete: false },
      companies: { create: true, read: true, update: true, delete: false },
      jobs: { create: true, read: true, update: true, delete: true },
      applications: { create: true, read: true, update: true, delete: false }
    };
  } else if (this.role === 'recruiter') {
    this.permissions = {
      users: { create: false, read: false, update: false, delete: false },
      companies: { create: false, read: true, update: false, delete: false },
      jobs: { create: true, read: true, update: true, delete: false },
      applications: { create: false, read: true, update: true, delete: false }
    };
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
