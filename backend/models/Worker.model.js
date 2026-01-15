import mongoose from 'mongoose';
import User from './User.model.js';

const workerSchema = new mongoose.Schema({
  profession: {
    type: String,
    required: [true, 'Please specify your profession'],
    trim: true
  },
  skills: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
      default: 'beginner'
    },
    proofType: {
      type: String,
      enum: ['project', 'certificate', 'none'],
      default: 'none'
    },
    proof: {
      // For projects
      projectTitle: String,
      projectDescription: String,
      projectUrl: String,
      projectImage: String,
      
      // For certificates
      certificateTitle: String,
      certificateIssuer: String,
      certificateDate: Date,
      certificateUrl: String,
      certificateId: String
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
      min: 0
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  experience: {
    type: Number,
    default: 0,
    min: 0
  },
  bio: {
    type: String,
    maxlength: 500
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  certificates: [{
    title: String,
    issuer: String,
    issueDate: Date,
    expiryDate: Date,
    certificateId: String,
    fileUrl: String,
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date
  }],
  portfolio: [{
    title: String,
    description: String,
    imageUrl: String,
    projectDate: Date
  }],
  availability: {
    status: {
      type: String,
      enum: ['available', 'busy', 'unavailable'],
      default: 'available'
    },
    workingHours: {
      start: String,
      end: String
    },
    workingDays: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }]
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  hourlyRate: {
    type: Number,
    min: 0
  },
  completedJobs: {
    type: Number,
    default: 0
  },
  languages: [{
    type: String
  }],
  preferences: {
    jobTypes: [{
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'temporary']
    }],
    maxDistance: {
      type: Number,
      default: 50 // in kilometers
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  }
});

// Create geospatial index
workerSchema.index({ 'location': '2dsphere' });

const Worker = User.discriminator('worker', workerSchema);

export default Worker;
