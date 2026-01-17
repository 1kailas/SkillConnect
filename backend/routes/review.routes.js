import express from 'express';
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful
} from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateObjectId } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/:userId', validateObjectId('userId'), getReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, validateObjectId(), updateReview);
router.delete('/:id', protect, validateObjectId(), deleteReview);
router.post('/:id/helpful', protect, validateObjectId(), markHelpful);

export default router;
