import express from 'express';
import { AdminController } from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Protect all admin routes
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/admin/users - Get all users
router.get('/users', AdminController.getUsers);

// GET /api/admin/users/:userId - Get specific user
router.get('/users/:userId', AdminController.getUser);

// PUT /api/admin/users/:userId/settings - Update user chat limit
router.put('/users/:userId/settings', AdminController.updateUserSettings);

// DELETE /api/admin/users/:userId - Delete user
router.delete('/users/:userId', AdminController.deleteUser);

// GET /api/admin/statistics - Get system statistics
router.get('/statistics', AdminController.getStatistics);

export default router;
