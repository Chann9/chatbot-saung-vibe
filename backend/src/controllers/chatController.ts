import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { generateAIResponse } from '../services/geminiService.js';

const prisma = new PrismaClient();

export class ChatController {
  // Get all conversations for logged-in user
  static async getConversations(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const conversations = await prisma.chatConversation.findMany({
        where: { userId },
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
          messages: {
            take: 1,
            orderBy: { createdAt: 'desc' },
            select: { message: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      return res.json({
        message: 'Conversations retrieved successfully',
        data: conversations,
      });
    } catch (error) {
      console.error('Get conversations error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get single conversation with all messages
  static async getConversation(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const conversation = await prisma.chatConversation.findFirst({
        where: {
          id: parseInt(conversationId),
          userId,
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }

      return res.json({
        message: 'Conversation retrieved successfully',
        data: conversation,
      });
    } catch (error) {
      console.error('Get conversation error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Create new conversation
  static async createConversation(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;
      const { title } = req.body;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Check user chat limit
      const userSettings = await prisma.userSettings.findUnique({
        where: { userId },
      });

      if (!userSettings) {
        return res.status(404).json({ message: 'User settings not found' });
      }

      if (userSettings.currentChatCount >= userSettings.chatLimit) {
        return res.status(400).json({
          message: `Chat limit reached. Current: ${userSettings.currentChatCount}/${userSettings.chatLimit}`,
        });
      }

      const conversation = await prisma.chatConversation.create({
        data: {
          userId,
          title: title || 'New Chat',
        },
      });

      // Increment chat count
      await prisma.userSettings.update({
        where: { userId },
        data: { currentChatCount: { increment: 1 } },
      });

      return res.status(201).json({
        message: 'Conversation created successfully',
        data: conversation,
      });
    } catch (error) {
      console.error('Create conversation error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Rename conversation
  static async renameConversation(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const { title } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!title || title.trim().length === 0) {
        return res.status(400).json({ message: 'Title is required' });
      }

      const conversation = await prisma.chatConversation.findFirst({
        where: {
          id: parseInt(conversationId),
          userId,
        },
      });

      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }

      const updated = await prisma.chatConversation.update({
        where: { id: parseInt(conversationId) },
        data: { title: title.trim() },
      });

      return res.json({
        message: 'Conversation renamed successfully',
        data: updated,
      });
    } catch (error) {
      console.error('Rename conversation error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Delete conversation
  static async deleteConversation(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const conversation = await prisma.chatConversation.findFirst({
        where: {
          id: parseInt(conversationId),
          userId,
        },
      });

      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }

      await prisma.chatConversation.delete({
        where: { id: parseInt(conversationId) },
      });

      // Decrement chat count
      await prisma.userSettings.update({
        where: { userId },
        data: { currentChatCount: { decrement: 1 } },
      });

      return res.json({ message: 'Conversation deleted successfully' });
    } catch (error) {
      console.error('Delete conversation error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Send message and get AI response
  static async sendMessage(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const { message } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!message || message.trim().length === 0) {
        return res.status(400).json({ message: 'Message is required' });
      }

      // Verify conversation belongs to user
      const conversation = await prisma.chatConversation.findFirst({
        where: {
          id: parseInt(conversationId),
          userId,
        },
      });

      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }

      // Save user message
      const userMessage = await prisma.chatMessage.create({
        data: {
          conversationId: parseInt(conversationId),
          sender: 'USER',
          message: message.trim(),
        },
      });

      // Generate AI response
      let aiResponse: string;
      try {
        aiResponse = await generateAIResponse(message.trim());
      } catch (error) {
        console.error('Gemini API error:', error);
        aiResponse = 'Maaf, terjadi kesalahan saat memproses pertanyaan Anda. Silakan coba lagi.';
      }

      // Save AI message
      const aiMessage = await prisma.chatMessage.create({
        data: {
          conversationId: parseInt(conversationId),
          sender: 'AI',
          message: aiResponse,
        },
      });

      // Update conversation updated_at timestamp
      await prisma.chatConversation.update({
        where: { id: parseInt(conversationId) },
        data: { updatedAt: new Date() },
      });

      return res.json({
        message: 'Message sent successfully',
        data: {
          userMessage,
          aiMessage,
        },
      });
    } catch (error) {
      console.error('Send message error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get messages for conversation
  static async getMessages(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Verify conversation belongs to user
      const conversation = await prisma.chatConversation.findFirst({
        where: {
          id: parseInt(conversationId),
          userId,
        },
      });

      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }

      const messages = await prisma.chatMessage.findMany({
        where: { conversationId: parseInt(conversationId) },
        orderBy: { createdAt: 'asc' },
      });

      return res.json({
        message: 'Messages retrieved successfully',
        data: messages,
      });
    } catch (error) {
      console.error('Get messages error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
