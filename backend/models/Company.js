
const mongoose = require('mongoose');

const spokespersonSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  role: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  contact: { type: String, trim: true }
}, { _id: false });

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  logo: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  size: {
    type: String,
    enum: ['startup', 'small', 'medium', 'large', 'enterprise'],
    default: 'medium'
  },
  spokespersons: {
    primary: spokespersonSchema,
    secondary: spokespersonSchema
  },
  isActive: {
    type: Boolean,
    default: true
  },
  foundedYear: {
    type: Number
  },
  socialLinks: {
    linkedin: String,
    twitter: String,
    facebook: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema);
