
const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Starting Elika Engineering Backend Server...');
console.log('📍 Current directory:', process.cwd());
console.log('🔧 Environment:', process.env.NODE_ENV || 'development');

// Check if .env file exists
const fs = require('fs');
const envPath = path.join(__dirname, '..', '.env');

if (!fs.existsSync(envPath)) {
  console.warn('⚠️  .env file not found. Creating from .env.example...');
  
  const examplePath = path.join(__dirname, '..', '.env.example');
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log('✅ .env file created from .env.example');
  } else {
    console.error('❌ .env.example file not found. Please create .env manually.');
  }
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

console.log('🌐 Backend will be available at: http://localhost:5000');
console.log('📊 Health check endpoint: http://localhost:5000/api/health');
console.log('🔑 Admin login: admin@elikaengineering.com / admin123');
console.log('');

// Start the server
require('../server.js');
