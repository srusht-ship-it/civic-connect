const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
require('dotenv').config({ path: '../.env' });

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Admin user details
    const adminData = {
      fullName: 'Admin User',
      email: 'admin@civicconnect.com',
      mobileNumber: '+919999999999',
      password: 'admin123', // Change this to a secure password
      role: 'admin',
      isEmailVerified: true,
      isMobileVerified: true
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('❌ Admin user already exists with email:', adminData.email);
      process.exit(1);
    }

    // Create admin user
    const adminUser = new User(adminData);
    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('📱 Mobile:', adminData.mobileNumber);
    console.log('🔑 Password:', adminData.password);
    console.log('');
    console.log('🚀 You can now login with these credentials and access /admin');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
};

// Run the script
createAdminUser();