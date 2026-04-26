import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminController {
  // Get all users
  static async getUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          settings: {
            select: {
              chatLimit: true,
              currentChatCount: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return res.json({
        message: 'Users retrieved successfully',
        data: users,
      });
    } catch (error) {
      console.error('Get users error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get single user
  static async getUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          settings: {
            select: {
              chatLimit: true,
              currentChatCount: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.json({
        message: 'User retrieved successfully',
        data: user,
      });
    } catch (error) {
      console.error('Get user error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Update user chat limit settings
  static async updateUserSettings(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { chatLimit } = req.body;

      if (!chatLimit || chatLimit < 0) {
        return res.status(400).json({ message: 'Invalid chat limit' });
      }

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const updated = await prisma.userSettings.update({
        where: { userId: parseInt(userId) },
        data: { chatLimit },
      });

      return res.json({
        message: 'User settings updated successfully',
        data: updated,
      });
    } catch (error) {
      console.error('Update user settings error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Delete user
  static async deleteUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Prevent deleting admin (optional, can be configured)
      if (user.role === 'ADMIN') {
        return res.status(400).json({ message: 'Cannot delete admin user' });
      }

      await prisma.user.delete({
        where: { id: parseInt(userId) },
      });

      return res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Delete user error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Get statistics
  static async getStatistics(req: Request, res: Response) {
    try {
      const totalUsers = await prisma.user.count();
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      const userCount = await prisma.user.count({ where: { role: 'USER' } });
      const totalConversations = await prisma.chatConversation.count();
      const totalMessages = await prisma.chatMessage.count();

      return res.json({
        message: 'Statistics retrieved successfully',
        data: {
          totalUsers,
          adminCount,
          userCount,
          totalConversations,
          totalMessages,
        },
      });
    } catch (error) {
      console.error('Get statistics error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
