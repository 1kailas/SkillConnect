import User from '../models/User.model.js';
import Worker from '../models/Worker.model.js';
import Employer from '../models/Employer.model.js';
import Job from '../models/Job.model.js';
import Review from '../models/Review.model.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res, next) => {
  try {
    const { role, isActive, page = 1, limit = 20 } = req.query;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip)
      .select('-password');

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
export const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive, isVerified } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admins from modifying admin accounts (including their own)
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify admin accounts'
      });
    }

    if (isActive !== undefined) {
      user.isActive = isActive;
    }

    if (isVerified !== undefined) {
      user.isVerified = isVerified;
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalWorkers = await Worker.countDocuments();
    const totalEmployers = await Employer.countDocuments();
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'open' });
    const completedJobs = await Job.countDocuments({ status: 'completed' });
    const totalReviews = await Review.countDocuments();

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Pending certificate verifications
    const pendingCertificates = await Worker.aggregate([
      { $unwind: '$certificates' },
      { $match: { 'certificates.isVerified': false } },
      { $count: 'total' }
    ]);

    const stats = {
      users: {
        total: totalUsers,
        workers: totalWorkers,
        employers: totalEmployers,
        recent: recentUsers
      },
      jobs: {
        total: totalJobs,
        active: activeJobs,
        completed: completedJobs
      },
      reviews: {
        total: totalReviews
      },
      certificates: {
        pending: pendingCertificates[0]?.total || 0
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get certificates pending verification
// @route   GET /api/admin/certificates/pending
// @access  Private/Admin
export const getCertificatesForVerification = async (req, res, next) => {
  try {
    const workers = await Worker.find({
      'certificates.isVerified': false
    }).select('name email phone certificates');

    const pendingCertificates = [];

    workers.forEach(worker => {
      worker.certificates.forEach(cert => {
        if (!cert.isVerified) {
          pendingCertificates.push({
            workerId: worker._id,
            workerName: worker.name,
            workerEmail: worker.email,
            certificate: cert
          });
        }
      });
    });

    res.status(200).json({
      success: true,
      count: pendingCertificates.length,
      data: pendingCertificates
    });
  } catch (error) {
    next(error);
  }
};
