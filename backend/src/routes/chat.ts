import express from 'express';
import { ChatController } from '../controllers/chatController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Protect all chat routes
router.use(authMiddleware);

// GET /api/chat - Get all conversations for user
router.get('/', ChatController.getConversations);

// POST /api/chat - Create new conversation
router.post('/', ChatController.createConversation);

// GET /api/chat/:conversationId - Get specific conversation with messages
router.get('/:conversationId', ChatController.getConversation);

// PUT /api/chat/:conversationId - Rename conversation
router.put('/:conversationId', ChatController.renameConversation);

// DELETE /api/chat/:conversationId - Delete conversation
router.delete('/:conversationId', ChatController.deleteConversation);

// POST /api/chat/:conversationId/message - Send message and get AI response
router.post('/:conversationId/message', ChatController.sendMessage);

// GET /api/chat/:conversationId/messages - Get all messages in conversation
router.get('/:conversationId/messages', ChatController.getMessages);

export default router;
