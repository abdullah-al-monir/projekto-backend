import express, { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';
import {
  validate,
  updateRoleSchema,
  updateStatusSchema,
} from '../middleware/validation.js';

const router: Router = express.Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Get all users
router.get('/', userController.getUsers);

// Update user role
router.patch(
  '/:id/role',
  validate(updateRoleSchema),
  userController.updateUserRole
);

// Update user status
router.patch(
  '/:id/status',
  validate(updateStatusSchema),
  userController.updateUserStatus
);

export default router;