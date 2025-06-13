
const mongoose = require('mongoose');
const User = require('../models/User');

// Load environment variables
require('dotenv').config();

const testUserAuthentication = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hiring_platform');
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find({}).select('email firstName lastName');
    
    console.log(`\nFound ${users.length} users in database:`);
    users.forEach(user => {
      console.log(`- ${user.email} (${user.firstName} ${user.lastName})`);
    });

    if (users.length === 0) {
      console.log('No users found in database');
      process.exit(0);
    }

    // Test password comparison for each user
    console.log('\nTesting password authentication...');
    
    for (const user of users) {
      // Get the full user with password
      const fullUser = await User.findById(user._id);
      
      console.log(`\nTesting user: ${fullUser.email}`);
      console.log(`Password hash starts with: ${fullUser.password.substring(0, 10)}...`);
      console.log(`Is hashed (starts with $2): ${fullUser.password.startsWith('$2')}`);
      
      // Test with some common test passwords
      const testPasswords = ['admin123', 'password123', 'Password123!', 'Admin123!'];
      
      for (const testPassword of testPasswords) {
        try {
          const isMatch = await fullUser.comparePassword(testPassword);
          if (isMatch) {
            console.log(`✅ Password "${testPassword}" matches for ${fullUser.email}`);
          }
        } catch (error) {
          console.log(`❌ Error testing password "${testPassword}" for ${fullUser.email}:`, error.message);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing authentication:', error);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  }
};

// Run the script
if (require.main === module) {
  testUserAuthentication();
}

module.exports = testUserAuthentication;
