import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.model.js';
import Worker from './models/Worker.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const seedWorkers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Check if workers exist
    const workerCount = await Worker.countDocuments();
    console.log(`Current workers in database: ${workerCount}`);

    if (workerCount > 0) {
      console.log('Workers already exist. Skipping seed.');
      process.exit(0);
    }

    // Read workers data
    const workersData = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data', 'workers.json'), 'utf-8')
    );

    console.log(`Seeding ${workersData.length} workers...`);

    // Create users and workers
    for (const workerData of workersData) {
      // Create user first
      const user = await User.create({
        name: workerData.name,
        email: workerData.email,
        phone: workerData.phone,
        password: workerData.password,
        role: 'worker'
      });

      // Create worker profile
      await Worker.create({
        userId: user._id,
        name: workerData.name,
        email: workerData.email,
        phone: workerData.phone,
        profession: workerData.profession,
        skills: workerData.skills,
        experience: workerData.experience,
        bio: workerData.bio,
        location: workerData.location,
        hourlyRate: workerData.hourlyRate,
        availability: workerData.availability,
        isActive: true,
        isVerified: Math.random() > 0.5, // Random verification
        rating: {
          average: (Math.random() * 2 + 3).toFixed(1), // 3-5 stars
          count: Math.floor(Math.random() * 50)
        },
        completedJobs: Math.floor(Math.random() * 30),
        languages: ['English', 'Hindi', 'Malayalam']
      });
    }

    console.log('✅ Workers seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding workers:', error);
    process.exit(1);
  }
};

seedWorkers();
