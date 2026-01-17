import Review from '../models/Review.model.js';
import Worker from '../models/Worker.model.js';
import Employer from '../models/Employer.model.js';
import User from '../models/User.model.js';

// @desc    Get reviews for a user
// @route   GET /api/reviews/:userId
// @access  Public
export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ 
      reviewee: req.params.userId,
      'reported.isReported': false
    })
      .populate('reviewer', 'name avatar role')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { reviewee, job, rating, categories, comment } = req.body;

    // Check if review already exists
    const existingReview = await Review.findOne({
      reviewer: req.user._id,
      reviewee,
      job
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this user for this job'
      });
    }

    const review = await Review.create({
      reviewer: req.user._id,
      reviewee,
      job,
      rating,
      categories,
      comment
    });

    // Update reviewee's rating
    const reviews = await Review.find({ reviewee });
    const avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;

    const revieweeUser = await User.findById(reviewee);
    if (revieweeUser.role === 'worker') {
      await Worker.findByIdAndUpdate(reviewee, {
        rating: {
          average: avgRating,
          count: reviews.length
        }
      });
    } else if (revieweeUser.role === 'employer') {
      await Employer.findByIdAndUpdate(reviewee, {
        rating: {
          average: avgRating,
          count: reviews.length
        }
      });
    }

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure user is review owner
    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    // Whitelist allowed fields to update
    const allowedFields = ['rating', 'categories', 'comment'];
    const updateData = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    review = await Review.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
export const markHelpful = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if already marked
    if (review.helpful.includes(req.user._id)) {
      // Remove from helpful
      review.helpful = review.helpful.filter(
        id => id.toString() !== req.user._id.toString()
      );
    } else {
      // Add to helpful
      review.helpful.push(req.user._id);
    }

    await review.save();

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};
