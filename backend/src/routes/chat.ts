import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Protect all chat routes
router.use(authMiddleware);

// TODO: Implement chat routes
// - GET /chat - Get all conversations for user
// - POST /chat - Create new conversation
// - GET /chat/:conversationId - Get specific conversation
// - PUT /chat/:conversationId - Rename conversation
// - DELETE /chat/:conversationId - Delete conversation
// - POST /chat/:conversationId/message - Send message
// - GET /chat/:conversationId/messages - Get messages

export default router;
