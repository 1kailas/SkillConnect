import express from 'express';
import {
  getWorkers,
  getWorker,
  updateWorker,
  deleteWorker,
  searchWorkers,
  updateCertificate,
  addPortfolio,
  deletePortfolio
} from '../controllers/worker.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { validateObjectId, sanitizePagination } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/', sanitizePagination, getWorkers);
router.get('/search', sanitizePagination, searchWorkers);
router.get('/:id', validateObjectId(), getWorker);
router.put('/profile', protect, authorize('worker'), updateWorker);
router.delete('/profile', protect, authorize('worker'), deleteWorker);
router.post('/certificate', protect, authorize('worker'), upload.single('certificate'), updateCertificate);
router.post('/portfolio', protect, authorize('worker'), upload.single('image'), addPortfolio);
router.delete('/portfolio/:portfolioId', protect, authorize('worker'), validateObjectId('portfolioId'), deletePortfolio);

export default router;
