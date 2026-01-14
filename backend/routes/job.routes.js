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
  searchJobs
} from '../controllers/job.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/search', searchJobs);
router.get('/applications/me', protect, authorize('worker'), getMyApplications);
router.get('/:id', getJob);
router.post('/', protect, authorize('employer'), createJob);
router.put('/:id', protect, authorize('employer'), updateJob);
router.delete('/:id', protect, authorize('employer'), deleteJob);
router.post('/:id/apply', protect, authorize('worker'), applyForJob);
router.get('/:id/applications', protect, authorize('employer'), getJobApplications);
router.put('/:id/applications/:applicationId', protect, authorize('employer'), updateApplicationStatus);

export default router;
