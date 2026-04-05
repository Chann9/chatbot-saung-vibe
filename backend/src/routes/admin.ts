import express from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Protect all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

// TODO: Implement admin routes
// - GET /admin/users - Get all users
// - GET /admin/users/:userId - Get specific user
// - PUT /admin/users/:userId/settings - Update user chat limit
// - DELETE /admin/users/:userId - Delete user

export default router;
