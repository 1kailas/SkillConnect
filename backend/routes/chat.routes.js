import express from 'express';
import {
  getChats,
  getChat,
  createChat,
  getMessages,
  sendMessage,
  sendAIMessage,
  clearAIConversation
} from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateObjectId, sanitizePagination } from '../middleware/validation.middleware.js';

const router = express.Router();

// All routes require authentication (including AI chat)
router.use(protect);

// AI chat endpoints
router.post('/ai/message', sendAIMessage);
router.delete('/ai/conversation/:conversationId', clearAIConversation);

// Chat routes
router.get('/', sanitizePagination, getChats);
router.post('/', createChat);
router.get('/:id', validateObjectId(), getChat);
router.get('/:id/messages', validateObjectId(), sanitizePagination, getMessages);
router.post('/:id/messages', validateObjectId(), sendMessage);

export default router;
