import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from '../controllers/notification.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateObjectId, sanitizePagination } from '../middleware/validation.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', sanitizePagination, getNotifications);
router.put('/:id/read', validateObjectId(), markAsRead);
router.put('/read-all', markAllAsRead);
router.delete('/:id', validateObjectId(), deleteNotification);

export default router;
