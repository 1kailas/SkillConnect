import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.model.js';
import Worker from './models/Worker.model.js';
import Employer from './models/Employer.model.js';

dotenv.config();

const updateUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Update 00kailas000@gmail.com to employer with password "password"
    let user1 = await User.findOne({ email: '00kailas000@gmail.com' });
    if (user1) {
      // Delete from Worker collection if exists
      await Worker.deleteOne({ email: '00kailas000@gmail.com' });
      // Delete the user
      await User.deleteOne({ email: '00kailas000@gmail.com' });
      console.log('✅ Deleted old user 00kailas000@gmail.com');
    }

    // Create as employer
    const employer = await Employer.create({
      name: 'Kailas',
      email: '00kailas000@gmail.com',
      phone: '6282766374',
      password: 'password',
      role: 'employer',
      companyName: 'Kailas Enterprises',
      companyType: 'individual',
      industry: 'Technology',
      description: 'Professional services company'
    });
    console.log('✅ Created 00kailas000@gmail.com as employer with password: password');

    // Create/update kailas62827@gmail.com as worker with password "password"
    let user2 = await User.findOne({ email: 'kailas62827@gmail.com' });
    if (user2) {
      await User.deleteOne({ email: 'kailas62827@gmail.com' });
      console.log('✅ Deleted old user kailas62827@gmail.com');
    }

    // Create as worker
    const worker = await Worker.create({
      name: 'Kailas Worker',
      email: 'kailas62827@gmail.com',
      phone: '6282766375',
      password: 'password',
      role: 'worker',
      profession: 'Electrician',
      skills: ['Wiring', 'Installation', 'Repair'],
      experience: 5,
      bio: 'Experienced electrician with 5 years of professional work.',
      location: {
        address: 'Kochi',
        city: 'Kochi',
        state: 'Kerala',
        pincode: '682016',
        coordinates: [76.2673, 9.9312]
      },
      hourlyRate: 500,
      availability: {
        status: 'available',
        workingHours: { start: '09:00', end: '18:00' },
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      }
    });
    console.log('✅ Created kailas62827@gmail.com as worker with password: password');

    console.log('\n✅ All done!');
    console.log('\nTest Credentials:');
    console.log('Employer: 00kailas000@gmail.com / password');
    console.log('Worker: kailas62827@gmail.com / password');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateUsers();
