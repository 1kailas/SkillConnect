/**
 * SkillConnect — Comprehensive Seed Script
 * 
 * Creates realistic test data:
 * - 1 Admin account
 * - 3 Workers with skills, certificates, profiles
 * - 2 Employers with company profiles
 * - 5 Jobs posted by employers
 * - Job applications from workers
 * - Reviews between users
 * - Notifications
 * 
 * Usage: node seed.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.model.js';
import Worker from './models/Worker.model.js';
import Employer from './models/Employer.model.js';
import Job from './models/Job.model.js';
import Review from './models/Review.model.js';
import Notification from './models/Notification.model.js';

dotenv.config();

// All seeded records use emails ending with @skillconnect-test.com so unseed can target them
const SEED_EMAIL_DOMAIN = 'skillconnect-test.com';

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Check if seed data already exists
        const existing = await User.findOne({ email: { $regex: `@${SEED_EMAIL_DOMAIN}$` } });
        if (existing) {
            console.log('⚠️  Seed data already exists. Run `node unseed.js` first to remove it.');
            await mongoose.connection.close();
            process.exit(0);
        }

        // ─── ADMIN ───
        // Admin doesn't have a discriminator model, so insert directly into the collection
        console.log('Creating admin...');
        const hashedPw = await hashPassword('Admin@1234');
        const adminResult = await User.collection.insertOne({
            name: 'Admin User',
            email: `admin@${SEED_EMAIL_DOMAIN}`,
            phone: '9000000001',
            password: hashedPw,
            role: 'admin',
            isVerified: true,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const adminId = adminResult.insertedId;

        // ─── WORKERS ───
        console.log('Creating workers...');
        const worker1 = await Worker.create({
            name: 'Anoop Krishnan',
            email: `anoop@${SEED_EMAIL_DOMAIN}`,
            phone: '9000000010',
            password: 'Test@1234',
            role: 'worker',
            isVerified: true,
            isActive: true,
            profession: 'Electrician',
            skills: [
                { name: 'Wiring', level: 'advanced', proofType: 'certificate', verified: true },
                { name: 'Panel Installation', level: 'intermediate', proofType: 'certificate', verified: false },
                { name: 'Solar Panel Setup', level: 'beginner' },
            ],
            experience: 5,
            bio: 'Licensed electrician with 5+ years of experience in residential and commercial wiring, panel installation, and solar systems.',
            location: { address: 'MG Road, Ernakulam', city: 'Kochi', state: 'Kerala', pincode: '682011' },
            hourlyRate: 600,
            languages: ['English', 'Malayalam', 'Hindi'],
            availability: { status: 'available' },
        });

        const worker2 = await Worker.create({
            name: 'Deepa Menon',
            email: `deepa@${SEED_EMAIL_DOMAIN}`,
            phone: '9000000011',
            password: 'Test@1234',
            role: 'worker',
            isVerified: true,
            isActive: true,
            profession: 'Plumber',
            skills: [
                { name: 'Pipe Fitting', level: 'advanced', proofType: 'certificate', verified: true },
                { name: 'Water Heater Installation', level: 'advanced' },
                { name: 'Drainage Systems', level: 'intermediate' },
            ],
            experience: 8,
            bio: 'Expert plumber specializing in residential plumbing, water heater installation, and drainage systems.',
            location: { address: 'Pattom', city: 'Trivandrum', state: 'Kerala', pincode: '695004' },
            hourlyRate: 500,
            languages: ['English', 'Malayalam'],
            availability: { status: 'available' },
        });

        const worker3 = await Worker.create({
            name: 'Vineeth Kumar',
            email: `vineeth@${SEED_EMAIL_DOMAIN}`,
            phone: '9000000012',
            password: 'Test@1234',
            role: 'worker',
            isVerified: false,
            isActive: true,
            profession: 'Carpenter',
            skills: [
                { name: 'Furniture Making', level: 'advanced', proofType: 'project' },
                { name: 'Wood Carving', level: 'intermediate' },
                { name: 'Interior Woodwork', level: 'advanced' },
            ],
            experience: 12,
            bio: 'Master carpenter with over a decade of experience creating custom furniture and interior woodwork.',
            location: { address: 'Calicut Road', city: 'Kozhikode', state: 'Kerala', pincode: '673001' },
            hourlyRate: 700,
            languages: ['English', 'Malayalam'],
            availability: { status: 'available' },
        });

        // ─── EMPLOYERS ───
        console.log('Creating employers...');
        const employer1 = await Employer.create({
            name: 'Ravi Nambiar',
            email: `ravi@${SEED_EMAIL_DOMAIN}`,
            phone: '9000000020',
            password: 'Test@1234',
            role: 'employer',
            isVerified: true,
            isActive: true,
            companyName: 'Kerala Home Builders Pvt Ltd',
            companyType: 'company',
            description: 'Leading construction and home renovation company in Kerala with 15+ years of experience.',
            location: { address: 'Technopark', city: 'Trivandrum', state: 'Kerala', pincode: '695581' },
        });

        const employer2 = await Employer.create({
            name: 'Priya Varma',
            email: `priya@${SEED_EMAIL_DOMAIN}`,
            phone: '9000000021',
            password: 'Test@1234',
            role: 'employer',
            isVerified: true,
            isActive: true,
            companyName: 'GreenBuild Solutions',
            companyType: 'contractor',
            description: 'Eco-friendly construction and renovation contractor specializing in sustainable building practices.',
            location: { address: 'Infopark', city: 'Kochi', state: 'Kerala', pincode: '682042' },
        });

        // ─── JOBS ───
        console.log('Creating jobs...');
        const job1 = await Job.create({
            title: 'Electrical Wiring for New House',
            description: 'Complete electrical wiring needed for a new 3BHK house in Trivandrum. Includes all rooms, kitchen, and outdoor lighting. Must follow Kerala State Electricity Board standards.',
            employer: employer1._id,
            category: 'electrical',
            jobType: 'contract',
            location: { type: 'Point', coordinates: [76.9366, 8.5241], address: 'Kazhakkoottam', city: 'Trivandrum', state: 'Kerala', pincode: '695582' },
            salary: { type: 'fixed', amount: 45000 },
            skills: ['Wiring', 'Panel Installation'],
            requirements: { experience: 3 },
            status: 'open',
        });

        const job2 = await Job.create({
            title: 'Kitchen Plumbing Renovation',
            description: 'Complete kitchen plumbing renovation for a commercial restaurant. Includes new pipe fitting, water heater installation, and drainage setup.',
            employer: employer1._id,
            category: 'plumbing',
            jobType: 'contract',
            location: { type: 'Point', coordinates: [76.2673, 9.9312], address: 'MG Road', city: 'Kochi', state: 'Kerala', pincode: '682011' },
            salary: { type: 'fixed', amount: 30000 },
            skills: ['Pipe Fitting', 'Drainage Systems'],
            requirements: { experience: 5 },
            status: 'open',
        });

        const job3 = await Job.create({
            title: 'Custom Furniture for Office',
            description: 'Need custom wooden furniture for a new office space. 10 desks, 2 conference tables, and reception counter. Premium teak wood preferred.',
            employer: employer2._id,
            category: 'carpentry',
            jobType: 'contract',
            location: { type: 'Point', coordinates: [76.3534, 10.0159], address: 'Infopark', city: 'Kochi', state: 'Kerala', pincode: '682042' },
            salary: { type: 'fixed', min: 80000, max: 120000 },
            skills: ['Furniture Making', 'Interior Woodwork'],
            requirements: { experience: 8 },
            status: 'open',
        });

        const job4 = await Job.create({
            title: 'Ongoing Maintenance Electrician',
            description: 'Looking for a reliable electrician for monthly maintenance of office electrical systems. Includes regular inspections and emergency repairs.',
            employer: employer2._id,
            category: 'electrical',
            jobType: 'part-time',
            location: { type: 'Point', coordinates: [76.3534, 10.0159], address: 'Infopark', city: 'Kochi', state: 'Kerala', pincode: '682042' },
            salary: { type: 'hourly', amount: 600 },
            skills: ['Wiring', 'Panel Installation'],
            requirements: { experience: 2 },
            status: 'open',
        });

        const job5 = await Job.create({
            title: 'House Painting - 4BHK Villa',
            description: 'Interior and exterior painting for a 4BHK villa. Total area approximately 3000 sq ft. Owner will provide paint; need experienced painters.',
            employer: employer1._id,
            category: 'painting',
            jobType: 'temporary',
            location: { type: 'Point', coordinates: [76.9553, 8.5348], address: 'Peroorkada', city: 'Trivandrum', state: 'Kerala', pincode: '695005' },
            salary: { type: 'fixed', min: 35000, max: 50000 },
            skills: ['Interior Painting', 'Exterior Painting'],
            requirements: { experience: 2 },
            status: 'open',
        });

        // ─── APPLICATIONS ───
        console.log('Creating applications...');
        // Worker 1 applies to electrical jobs
        job1.applicants.push({
            worker: worker1._id,
            coverLetter: 'I have 5+ years of experience in residential wiring and hold a valid electrical license. I can complete this job within 2 weeks.',
            status: 'pending',
            appliedAt: new Date(),
        });
        await job1.save();

        job4.applicants.push({
            worker: worker1._id,
            coverLetter: 'I am available for monthly maintenance work and have experience with commercial electrical systems.',
            status: 'pending',
            appliedAt: new Date(),
        });
        await job4.save();

        // Worker 2 applies to plumbing job
        job2.applicants.push({
            worker: worker2._id,
            coverLetter: 'With 8 years of plumbing experience, I specialize in commercial kitchen plumbing installations.',
            status: 'hired',
            appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        });
        await job2.save();

        // Worker 3 applies to carpentry job
        job3.applicants.push({
            worker: worker3._id,
            coverLetter: 'I have 12 years of woodworking experience and can deliver custom furniture that meets your exact specifications.',
            status: 'pending',
            appliedAt: new Date(),
        });
        await job3.save();

        // ─── REVIEWS ───
        console.log('Creating reviews...');
        await Review.create({
            reviewer: employer1._id,
            reviewee: worker2._id,
            job: job2._id,
            rating: 5,
            comment: 'Excellent work on the kitchen plumbing. Very professional and completed on time. Highly recommended!',
            categories: { quality: 5, punctuality: 5, communication: 4, professionalism: 5 },
        });

        await Review.create({
            reviewer: worker2._id,
            reviewee: employer1._id,
            job: job2._id,
            rating: 4,
            comment: 'Good employer. Clear requirements and timely payment. Would work with again.',
            categories: { quality: 4, punctuality: 4, communication: 4, professionalism: 5 },
        });

        // ─── NOTIFICATIONS ───
        console.log('Creating notifications...');
        await Notification.create({
            recipient: worker1._id,
            type: 'job_application',
            title: 'Application Submitted',
            message: `Your application for "${job1.title}" has been submitted successfully.`,
            relatedId: job1._id,
            relatedModel: 'Job',
        });

        await Notification.create({
            recipient: worker2._id,
            type: 'job_hired',
            title: 'You\'ve Been Hired!',
            message: `Congratulations! You've been hired for "${job2.title}".`,
            relatedId: job2._id,
            relatedModel: 'Job',
        });

        await Notification.create({
            recipient: employer1._id,
            type: 'new_review',
            title: 'New Review Received',
            message: 'Deepa Menon left a review for your job.',
            relatedId: job2._id,
            relatedModel: 'Review',
        });

        // ─── SUMMARY ───
        console.log('\n' + '═'.repeat(50));
        console.log('  ✅ SEED DATA CREATED SUCCESSFULLY');
        console.log('═'.repeat(50));
        console.log('\n📋 Test Credentials (password for all: Test@1234)\n');
        console.log('  👑 Admin:');
        console.log(`     admin@${SEED_EMAIL_DOMAIN}`);
        console.log('\n  👷 Workers:');
        console.log(`     anoop@${SEED_EMAIL_DOMAIN}    (Electrician)`);
        console.log(`     deepa@${SEED_EMAIL_DOMAIN}    (Plumber)`);
        console.log(`     vineeth@${SEED_EMAIL_DOMAIN}  (Carpenter)`);
        console.log('\n  🏢 Employers:');
        console.log(`     ravi@${SEED_EMAIL_DOMAIN}     (Kerala Home Builders)`);
        console.log(`     priya@${SEED_EMAIL_DOMAIN}    (GreenBuild Solutions)`);
        console.log('\n  📊 Data Created:');
        console.log('     5 Jobs, 4 Applications, 2 Reviews, 3 Notifications');
        console.log('\n  🗑️  To remove all test data: node unseed.js\n');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        if (error.code === 11000) {
            console.error('   A duplicate record was found. Run `node unseed.js` first.');
        }
        await mongoose.connection.close();
        process.exit(1);
    }
};

seed();
