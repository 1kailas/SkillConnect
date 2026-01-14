import Job from '../models/Job.model.js';
import Employer from '../models/Employer.model.js';
import { safeRegex } from '../utils/sanitize.js';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req, res, next) => {
  try {
    const {
      category,
      jobType,
      city,
      status = 'open',
      page = 1,
      limit = 12,
      sortBy = '-createdAt',
      employer
    } = req.query;

    const query = { isActive: true };

    // If employer is 'me', filter by logged-in user
    if (employer === 'me' && req.user) {
      query.employer = req.user._id;
    } else if (employer) {
      query.employer = employer;
    }

    if (category) {
      query.category = category;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (city) {
      query['location.city'] = safeRegex(city);
    }

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(query)
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('employer', 'name companyName avatar rating');

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search jobs by location
// @route   GET /api/jobs/search
// @access  Public
export const searchJobs = async (req, res, next) => {
  try {
    const {
      lat,
      lng,
      distance = 50,
      skills,
      category,
      jobType,
      page = 1,
      limit = 12
    } = req.query;

    let query = { isActive: true, status: 'open' };

    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(distance) * 1000
        }
      };
    }

    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query.skills = { $in: skillsArray.map(skill => safeRegex(skill)) };
    }

    if (category) {
      query.category = category;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('employer', 'name companyName avatar rating');

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
export const getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name companyName avatar rating location phone email')
      .populate('applicants.worker', 'name avatar profession rating location');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create job
// @route   POST /api/jobs
// @access  Private/Employer
export const createJob = async (req, res, next) => {
  try {
    req.body.employer = req.user._id;

    const job = await Job.create(req.body);

    // Update employer's job count
    await Employer.findByIdAndUpdate(req.user._id, {
      $inc: { jobsPosted: 1 }
    });

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private/Employer
export const updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Make sure user is job owner
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private/Employer
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply for job
// @route   POST /api/jobs/:id/apply
// @access  Private/Worker
export const applyForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if already applied
    const alreadyApplied = job.applicants.find(
      app => app.worker.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    job.applicants.push({
      worker: req.user._id,
      coverLetter: req.body.coverLetter
    });

    await job.save();

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get job applications
// @route   GET /api/jobs/:id/applications
// @access  Private/Employer
export const getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('applicants.worker', 'name avatar profession rating location skills experience');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to view applications'
      });
    }

    res.status(200).json({
      success: true,
      count: job.applicants.length,
      data: job.applicants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my applications (for workers)
// @route   GET /api/jobs/applications/me
// @access  Private/Worker
export const getMyApplications = async (req, res, next) => {
  try {
    // Find all jobs where current user has applied
    const jobs = await Job.find({
      'applicants.worker': req.user._id
    })
      .populate('employer', 'name companyName avatar rating')
      .select('title category location salary applicants employer createdAt views');

    // Extract applications for this user
    const applications = jobs.map(job => {
      const myApplication = job.applicants.find(
        app => app.worker.toString() === req.user._id.toString()
      );
      return {
        _id: myApplication._id,
        job: {
          _id: job._id,
          title: job.title,
          category: job.category,
          location: job.location,
          salary: job.salary,
          employer: job.employer,
          views: job.views
        },
        status: myApplication.status,
        appliedAt: myApplication.appliedAt,
        coverLetter: myApplication.coverLetter
      };
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/jobs/:id/applications/:applicationId
// @access  Private/Employer
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const application = job.applicants.id(req.params.applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application.status = req.body.status;

    if (req.body.status === 'hired') {
      job.hiredWorker = application.worker;
      job.status = 'in-progress';
    }

    await job.save();

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw application
// @route   DELETE /api/jobs/:id/applications/:applicationId
// @access  Private/Worker
export const withdrawApplication = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const application = job.applicants.id(req.params.applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if the logged in user is the applicant
    if (application.worker.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to withdraw this application'
      });
    }

    // Check if application can be withdrawn
    if (application.status === 'hired') {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw an application that has been hired'
      });
    }

    // Remove the application
    application.deleteOne();
    await job.save();

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    next(error);
  }
};
