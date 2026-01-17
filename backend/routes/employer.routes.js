import express from 'express';
import {
  getEmployer,
  updateEmployer,
  deleteEmployer
} from '../controllers/employer.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validateObjectId } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/:id', validateObjectId(), getEmployer);
router.put('/profile', protect, authorize('employer'), updateEmployer);
router.delete('/profile', protect, authorize('employer'), deleteEmployer);

export default router;
