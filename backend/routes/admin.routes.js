import express from 'express';
import {
  getUsers,
  updateUserStatus,
  getStats,
  getCertificatesForVerification
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validateObjectId, sanitizePagination } from '../middleware/validation.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/users', sanitizePagination, getUsers);
router.put('/users/:id/status', validateObjectId(), updateUserStatus);
router.get('/stats', getStats);
router.get('/certificates/pending', sanitizePagination, getCertificatesForVerification);

export default router;
