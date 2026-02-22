/**
 * SkillConnect — Unseed Script
 * 
 * Removes ALL test data created by seed.js
 * Only targets records with @skillconnect-test.com emails
 * 
 * Usage: node unseed.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.model.js';
import Worker from './models/Worker.model.js';
import Employer from './models/Employer.model.js';
import Job from './models/Job.model.js';
import Review from './models/Review.model.js';
import Notification from './models/Notification.model.js';

dotenv.config();

const SEED_EMAIL_DOMAIN = 'skillconnect-test.com';

const unseed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find all seed users
        const seedUsers = await User.find({ email: { $regex: `@${SEED_EMAIL_DOMAIN}$` } });
        const seedUserIds = seedUsers.map(u => u._id);

        if (seedUserIds.length === 0) {
            console.log('ℹ️  No seed data found. Nothing to remove.');
            await mongoose.connection.close();
            process.exit(0);
        }

        console.log(`Found ${seedUserIds.length} seed users to remove.\n`);

        // Delete in order: dependent data first
        const notifResult = await Notification.deleteMany({ recipient: { $in: seedUserIds } });
        console.log(`  🗑️  Notifications: ${notifResult.deletedCount} removed`);

        const reviewResult = await Review.deleteMany({
            $or: [
                { reviewer: { $in: seedUserIds } },
                { reviewee: { $in: seedUserIds } },
            ]
        });
        console.log(`  🗑️  Reviews: ${reviewResult.deletedCount} removed`);

        const jobResult = await Job.deleteMany({ employer: { $in: seedUserIds } });
        console.log(`  🗑️  Jobs: ${jobResult.deletedCount} removed`);

        // Delete employers (discriminator)
        const employerResult = await Employer.deleteMany({ email: { $regex: `@${SEED_EMAIL_DOMAIN}$` } });
        console.log(`  🗑️  Employers: ${employerResult.deletedCount} removed`);

        // Delete workers (discriminator)
        const workerResult = await Worker.deleteMany({ email: { $regex: `@${SEED_EMAIL_DOMAIN}$` } });
        console.log(`  🗑️  Workers: ${workerResult.deletedCount} removed`);

        // Delete remaining base users (admins)
        const userResult = await User.deleteMany({ email: { $regex: `@${SEED_EMAIL_DOMAIN}$` } });
        console.log(`  🗑️  Users: ${userResult.deletedCount} removed`);

        console.log('\n' + '═'.repeat(40));
        console.log('  ✅ ALL SEED DATA REMOVED');
        console.log('═'.repeat(40));
        console.log('\n  Run `node seed.js` to re-create test data.\n');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Unseed error:', error.message);
        await mongoose.connection.close();
        process.exit(1);
    }
};

unseed();
