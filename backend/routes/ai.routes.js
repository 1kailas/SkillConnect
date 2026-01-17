import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.middleware.js';
import {
  getJobRecommendations,
  getWorkerRecommendations,
  analyzeSkillGap,
  getSkillRecommendations,
  enhanceText,
  enhanceSearch,
  generateInterviewQuestions,
  estimateSalary,
  chat,
  clearConversation,
  getHealth
} from '../controllers/ai.controller.js';

const router = express.Router();

// Validation middleware
const jobRecommendationValidation = [
  body('workerId').notEmpty().withMessage('Worker ID is required')
];

const workerRecommendationValidation = [
  body('jobId').notEmpty().withMessage('Job ID is required')
];

const skillGapValidation = [
  body('currentSkills').isArray().withMessage('Current skills must be an array'),
  body('targetProfession').notEmpty().withMessage('Target profession is required')
];

const enhanceTextValidation = [
  body('text').isLength({ min: 10 }).withMessage('Text must be at least 10 characters'),
  body('type').optional().isIn(['jobDescription', 'workerBio', 'jobTitle', 'coverLetter', 'companyDescription'])
];

const chatValidation = [
  body('message').notEmpty().withMessage('Message is required'),
  body('role').optional().isIn(['worker', 'employer', 'admin', 'general'])
];

// Routes

// Health check - public
router.get('/health', getHealth);

// All AI routes require authentication
router.use(protect);

// Recommendations
router.post('/recommendations/jobs', jobRecommendationValidation, getJobRecommendations);
router.post('/recommendations/workers', workerRecommendationValidation, getWorkerRecommendations);

// Skills
router.post('/skills/gap-analysis', skillGapValidation, analyzeSkillGap);
router.post('/skills/recommendations', getSkillRecommendations);

// Text enhancement
router.post('/enhance', enhanceTextValidation, enhanceText);

// Search
router.post('/search/enhance', enhanceSearch);

// Interview
router.post('/interview/questions', generateInterviewQuestions);

// Salary
router.post('/salary/estimate', estimateSalary);

// Chat
router.post('/chat', chatValidation, chat);
router.delete('/chat/:conversationId', clearConversation);

export default router;
