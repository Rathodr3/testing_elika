
const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Starting Elika Engineering Backend Server...');
console.log('📍 Current directory:', process.cwd());
console.log('🔧 Environment:', process.env.NODE_ENV || 'development');

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

if (majorVersion < 22) {
  console.warn(`⚠️  Node.js version ${nodeVersion} detected. Recommended: Node.js 22 LTS or higher`);
} else {
  console.log(`✅ Node.js version ${nodeVersion} (compatible)`);
}

// Check npm version
exec('npm --version', (error, stdout, stderr) => {
  if (error) {
    console.warn('⚠️  Could not check npm version');
  } else {
    const npmVersion = stdout.trim();
    console.log(`📦 npm version: ${npmVersion}`);
    
    const majorNpmVersion = parseInt(npmVersion.split('.')[0]);
    if (majorNpmVersion < 11) {
      console.warn(`⚠️  npm version ${npmVersion} detected. Recommended: npm 11.4.2 or higher`);
      console.log('💡 To upgrade npm: npm install -g npm@latest');
    } else {
      console.log(`✅ npm version ${npmVersion} (compatible)`);
    }
  }
});

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
console.log('🔒 Security: Updated to latest versions with vulnerability patches');
console.log('');

// Start the server
require('../server.js');
