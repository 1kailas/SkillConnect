import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';

dotenv.config();

const resetPasswords = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    // Update each user's password to 'password123'
    for (const user of users) {
      user.password = 'password123';
      await user.save();
      console.log(`✅ Updated password for ${user.email}`);
    }

    console.log('✅ All passwords reset to: password123');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetPasswords();
