import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide job title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide job description']
  },
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['construction', 'plumbing', 'electrical', 'carpentry', 'painting', 
           'welding', 'masonry', 'landscaping', 'cleaning', 'other']
  },
  skills: [{
    type: String,
    trim: true
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: String,
    city: String,
    state: String,
    pincode: String
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'temporary'],
    required: true
  },
  duration: {
    value: Number,
    unit: {
      type: String,
      enum: ['days', 'weeks', 'months']
    }
  },
  salary: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 0
    },
    amount: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'INR'
    },
    type: {
      type: String,
      enum: ['hourly', 'daily', 'weekly', 'monthly', 'fixed'],
      default: 'monthly'
    }
  },
  requirements: {
    experience: Number,
    education: String,
    certifications: [String]
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled', 'closed'],
    default: 'open'
  },
  applicants: [{
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
      default: 'pending'
    },
    coverLetter: String
  }],
  hiredWorker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  startDate: Date,
  endDate: Date,
  workersNeeded: {
    type: Number,
    default: 1,
    min: 1
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Create indexes
jobSchema.index({ location: '2dsphere' });
jobSchema.index({ employer: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ createdAt: -1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;
