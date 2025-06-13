
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Password validation function - only validate if it's not already hashed
const validatePassword = function(password) {
  // If password looks like a bcrypt hash, skip validation
  if (password && password.startsWith('$2')) {
    return true;
  }
  
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return password.length >= minLength && hasUpperCase && hasNumber && hasSpecialChar;
};

const permissionSchema = new mongoose.Schema({
  create: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
  update: { type: Boolean, default: false },
  delete: { type: Boolean, default: false }
}, { _id: false });

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
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: validatePassword,
      message: 'Password must contain at least 8 characters, 1 uppercase letter, 1 number, and 1 special character'
    }
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'hr_manager', 'recruiter', 'viewer'],
    default: 'viewer'
  },
  permissions: {
    users: permissionSchema,
    companies: permissionSchema,
    jobs: permissionSchema,
    applications: permissionSchema
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpires: {
    type: Date
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified and not already hashed
  if (!this.isModified('password')) return next();
  
  // Check if password is already hashed (bcrypt hashes start with $2)
  if (this.password && this.password.startsWith('$2')) {
    console.log('Password already hashed, skipping hashing');
    return next();
  }
  
  try {
    console.log('Hashing password for user:', this.email);
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error('Password hashing error:', error);
    next(error);
  }
});

// Hash password before update operations
userSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();
  
  // Check if password is being updated
  if (update.password) {
    // Check if password is already hashed
    if (update.password.startsWith('$2')) {
      console.log('Password already hashed in update, skipping hashing');
      return next();
    }
    
    try {
      console.log('Hashing password in update operation');
      const salt = await bcrypt.genSalt(10);
      update.password = await bcrypt.hash(update.password, salt);
      next();
    } catch (error) {
      console.error('Password hashing error in update:', error);
      next(error);
    }
  } else {
    next();
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    const result = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password comparison for user:', this.email, 'Result:', result);
    return result;
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

module.exports = mongoose.model('User', userSchema);
