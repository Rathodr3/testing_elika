
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Load environment variables
require('dotenv').config();

const hashPlaintextPasswords = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hiring_platform');
    console.log('Connected to MongoDB');

    // Find all users with plaintext passwords (passwords that don't start with $2)
    const users = await User.find({
      password: { $not: /^\$2/ }
    });

    console.log(`Found ${users.length} users with plaintext passwords`);

    if (users.length === 0) {
      console.log('No users with plaintext passwords found');
      process.exit(0);
    }

    // Hash passwords for each user
    for (const user of users) {
      console.log(`Hashing password for user: ${user.email}`);
      
      // Generate salt and hash
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      
      // Update user with hashed password directly in database
      await User.updateOne(
        { _id: user._id },
        { $set: { password: hashedPassword } }
      );
      
      console.log(`✅ Password hashed for user: ${user.email}`);
    }

    console.log(`\n✅ Successfully hashed passwords for ${users.length} users`);
    
  } catch (error) {
    console.error('❌ Error hashing passwords:', error);
  } finally {
    // Close database connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the script
if (require.main === module) {
  hashPlaintextPasswords();
}

module.exports = hashPlaintextPasswords;
