import { Chat, Message } from '../models/Chat.model.js';
import aiService from '../services/ai.service.js';

// @desc    Get all chats for user
// @route   GET /api/chat
// @access  Private
export const getChats = async (req, res, next) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id,
      isActive: true
    })
      .populate('participants', 'name avatar role')
      .populate('lastMessage.sender', 'name')
      .sort('-updatedAt');

    res.status(200).json({
      success: true,
      count: chats.length,
      data: chats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single chat
// @route   GET /api/chat/:id
// @access  Private
export const getChat = async (req, res, next) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants', 'name avatar role');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    if (!chat.participants.some(p => p._id.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this chat'
      });
    }

    res.status(200).json({
      success: true,
      data: chat
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new chat
// @route   POST /api/chat
// @access  Private
export const createChat = async (req, res, next) => {
  try {
    const { participantId, jobId } = req.body;

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      participants: { $all: [req.user._id, participantId] },
      job: jobId
    });

    if (existingChat) {
      return res.status(200).json({
        success: true,
        data: existingChat
      });
    }

    const chat = await Chat.create({
      participants: [req.user._id, participantId],
      job: jobId
    });

    await chat.populate('participants', 'name avatar role');

    res.status(201).json({
      success: true,
      data: chat
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get messages for chat
// @route   GET /api/chat/:id/messages
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    // Verify user is participant
    const chat = await Chat.findById(req.params.id);
    if (!chat || !chat.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.find({ chat: req.params.id })
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(skip)
      .populate('sender', 'name avatar');

    const total = await Message.countDocuments({ chat: req.params.id });

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: messages.reverse()
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send message
// @route   POST /api/chat/:id/messages
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { text, attachments } = req.body;

    // Verify user is participant
    const chat = await Chat.findById(req.params.id);
    if (!chat || !chat.participants.some(p => p.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const message = await Message.create({
      chat: req.params.id,
      sender: req.user._id,
      text,
      attachments
    });

    // Update chat's last message
    chat.lastMessage = {
      text,
      sender: req.user._id,
      timestamp: new Date()
    };

    // Update unread count for other participants
    chat.participants.forEach(participantId => {
      if (participantId.toString() !== req.user._id.toString()) {
        const currentCount = chat.unreadCount.get(participantId.toString()) || 0;
        chat.unreadCount.set(participantId.toString(), currentCount + 1);
      }
    });

    await chat.save();

    await message.populate('sender', 'name avatar');

    // Emit socket event (handled in server.js)
    const io = req.app.get('io');
    io.to(req.params.id).emit('receive-message', message);

    res.status(201).json({
      success: true,
      data: message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send message with AI response
// @route   POST /api/chat/ai/message
// @access  Public
export const sendAIMessage = async (req, res, next) => {
  try {
    const { message, conversationId, role } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Use shared aiService instead of duplicate Groq client
    const chatRole = role === 'worker' ? 'employer' : 'worker';
    const aiResponse = await aiService.chat(
      message,
      conversationId || `chat-${Date.now()}`,
      chatRole
    );

    res.status(200).json({
      success: true,
      data: {
        message: aiResponse,
        conversationId: conversationId || `chat-${Date.now()}`
      }
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process message',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Clear AI conversation
// @route   DELETE /api/chat/ai/conversation/:conversationId
// @access  Public
export const clearAIConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    aiService.clearConversation(conversationId);

    res.status(200).json({
      success: true,
      message: 'Conversation cleared'
    });
  } catch (error) {
    next(error);
  }
};
