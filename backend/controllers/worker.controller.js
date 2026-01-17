import Worker from '../models/Worker.model.js';
import { safeRegex } from '../utils/sanitize.js';

// @desc    Get all workers
// @route   GET /api/workers
// @access  Public
export const getWorkers = async (req, res, next) => {
  try {
    const { 
      skill, 
      city, 
      rating, 
      availability, 
      page = 1, 
      limit = 12,
      sortBy = '-createdAt'
    } = req.query;

    const query = { isActive: true };

    if (skill) {
      query['skills.name'] = { $regex: safeRegex(skill), $options: 'i' };
    }

    if (city) {
      query['location.city'] = safeRegex(city);
    }

    if (rating) {
      query['rating.average'] = { $gte: parseFloat(rating) };
    }

    if (availability) {
      query['availability.status'] = availability;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const workers = await Worker.find(query)
      .sort(sortBy)
      .limit(parseInt(limit))
      .skip(skip)
      .select('-password');

    const total = await Worker.countDocuments(query);

    res.status(200).json({
      success: true,
      count: workers.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: workers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search workers by location and skills
// @route   GET /api/workers/search
// @access  Public
export const searchWorkers = async (req, res, next) => {
  try {
    const { 
      lat, 
      lng, 
      distance = 50, 
      skills, 
      availability,
      minRating = 0,
      page = 1,
      limit = 12
    } = req.query;

    let query = { isActive: true };

    // Geospatial search
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(distance) * 1000 // Convert km to meters
        }
      };
    }

    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query['skills.name'] = { $in: skillsArray.map(skill => new RegExp(safeRegex(skill), 'i')) };
    }

    if (availability) {
      query['availability.status'] = availability;
    }

    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const workers = await Worker.find(query)
      .limit(parseInt(limit))
      .skip(skip)
      .select('-password');

    const total = await Worker.countDocuments(query);

    res.status(200).json({
      success: true,
      count: workers.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: workers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single worker
// @route   GET /api/workers/:id
// @access  Public
export const getWorker = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.params.id).select('-password');

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    res.status(200).json({
      success: true,
      data: worker
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update worker profile
// @route   PUT /api/workers/profile
// @access  Private/Worker
export const updateWorker = async (req, res, next) => {
  try {
    // Whitelist allowed fields
    const allowedFields = [
      'name', 'phone', 'avatar', 'profession', 'bio', 'skills',
      'experience', 'hourlyRate', 'availability', 'location', 'languages',
      'certifications', 'portfolio', 'socialLinks'
    ];
    
    const fieldsToUpdate = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        fieldsToUpdate[field] = req.body[field];
      }
    });

    // Ensure no protected fields can be updated
    delete fieldsToUpdate.password;
    delete fieldsToUpdate.role;
    delete fieldsToUpdate.email;
    delete fieldsToUpdate.isActive;
    delete fieldsToUpdate.isVerified;
    delete fieldsToUpdate.rating;

    const worker = await Worker.findByIdAndUpdate(
      req.user._id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: worker
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete worker account
// @route   DELETE /api/workers/profile
// @access  Private/Worker
export const deleteWorker = async (req, res, next) => {
  try {
    await Worker.findByIdAndUpdate(req.user._id, { isActive: false });

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add/Update certificate
// @route   POST /api/workers/certificate
// @access  Private/Worker
export const updateCertificate = async (req, res, next) => {
  try {
    const { title, issuer, issueDate, expiryDate, certificateId } = req.body;

    const certificate = {
      title,
      issuer,
      issueDate,
      expiryDate,
      certificateId,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : undefined,
      isVerified: false
    };

    const worker = await Worker.findById(req.user._id);
    worker.certificates.push(certificate);
    await worker.save();

    res.status(200).json({
      success: true,
      data: worker
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add portfolio item
// @route   POST /api/workers/portfolio
// @access  Private/Worker
export const addPortfolio = async (req, res, next) => {
  try {
    const { title, description, projectDate } = req.body;

    const portfolioItem = {
      title,
      description,
      projectDate,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined
    };

    const worker = await Worker.findById(req.user._id);
    worker.portfolio.push(portfolioItem);
    await worker.save();

    res.status(200).json({
      success: true,
      data: worker
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete portfolio item
// @route   DELETE /api/workers/portfolio/:portfolioId
// @access  Private/Worker
export const deletePortfolio = async (req, res, next) => {
  try {
    const worker = await Worker.findById(req.user._id);
    worker.portfolio = worker.portfolio.filter(
      item => item._id.toString() !== req.params.portfolioId
    );
    await worker.save();

    res.status(200).json({
      success: true,
      data: worker
    });
  } catch (error) {
    next(error);
  }
};
