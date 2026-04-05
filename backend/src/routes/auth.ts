import express, { Request, Response, NextFunction } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', AuthController.register);

// POST /api/auth/login
router.post('/login', AuthController.login);

// POST /api/auth/refresh-token
router.post('/refresh-token', authMiddleware, AuthController.refreshToken);

// GET /api/auth/profile
router.get('/profile', authMiddleware, AuthController.getProfile);

export default router;
