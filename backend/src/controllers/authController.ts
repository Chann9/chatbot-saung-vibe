import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { validateEmail, validatePassword, validateUsername } from '../utils/validators.js';

const prisma = new PrismaClient();

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { username, email, password, confirmPassword } = req.body;

      // Validation
      if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({
          message: 'All fields are required',
        });
      }

      if (!validateUsername(username)) {
        return res.status(400).json({
          message: 'Username must be at least 3 characters and contain only letters, numbers, and underscores',
        });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({
          message: 'Invalid email format',
        });
      }

      if (!validatePassword(password)) {
        return res.status(400).json({
          message: 'Password must be at least 6 characters',
        });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({
          message: 'Passwords do not match',
        });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      if (existingUser) {
        return res.status(409).json({
          message: 'Username or email already exists',
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role: 'USER',
        },
      });

      // Create user settings with default chat limit
      await prisma.userSettings.create({
        data: {
          userId: user.id,
          chatLimit: 10,
          currentChatCount: 0,
        },
      });

      // Generate token
      const token = generateToken({
        userId: user.id,
        username: user.username,
        role: user.role,
      });

      return res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error('Register error:', error);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Validation
      if (!username || !password) {
        return res.status(400).json({
          message: 'Username and password are required',
        });
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        return res.status(401).json({
          message: 'Invalid username or password',
        });
      }

      // Compare password
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'Invalid username or password',
        });
      }

      // Generate token
      const token = generateToken({
        userId: user.id,
        username: user.username,
        role: user.role,
      });

      return res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { userId } = req.user!;

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      // Generate new token
      const token = generateToken({
        userId: user.id,
        username: user.username,
        role: user.role,
      });

      return res.json({
        message: 'Token refreshed successfully',
        token,
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const { userId } = req.user!;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          settings: true,
        },
      });

      if (!user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      return res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          settings: user.settings,
        },
      });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  }
}
