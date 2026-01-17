import express from 'express';
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  applyForJob,
  getJobApplications,
  getMyApplications,
  updateApplicationStatus,
  withdrawApplication,
  searchJobs
} from '../controllers/job.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';
import { validateObjectId, validateObjectIds, sanitizePagination, sanitizeSort } from '../middleware/validation.middleware.js';

const router = express.Router();

router.get('/', sanitizePagination, sanitizeSort, getJobs);
router.get('/search', sanitizePagination, searchJobs);
router.get('/applications/me', protect, authorize('worker'), sanitizePagination, getMyApplications);
router.get('/:id', validateObjectId(), getJob);
router.post('/', protect, authorize('employer'), createJob);
router.put('/:id', protect, authorize('employer'), validateObjectId(), updateJob);
router.delete('/:id', protect, authorize('employer'), validateObjectId(), deleteJob);
router.post('/:id/apply', protect, authorize('worker'), validateObjectId(), applyForJob);
router.get('/:id/applications', protect, authorize('employer'), validateObjectId(), sanitizePagination, getJobApplications);
router.put('/:id/applications/:applicationId', protect, authorize('employer'), validateObjectIds('id', 'applicationId'), updateApplicationStatus);
router.delete('/:id/applications/:applicationId', protect, authorize('worker'), validateObjectIds('id', 'applicationId'), withdrawApplication);

export default router;
