import express, { Router } from 'express';
import * as authController from '../controllers/authController.js';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';
import {
  validate,
  loginSchema,
  inviteSchema,
  registerSchema,
} from '../middleware/validation.js';

const router: Router = express.Router();

// Public routes
router.post('/login', validate(loginSchema), authController.login);
router.post(
  '/register-via-invite',
  validate(registerSchema),
  authController.registerViaInvite
);

// Protected routes
router.use(authenticate);

// Admin only
router.post(
  '/invite',
  requireAdmin,
  validate(inviteSchema),
  authController.inviteUser
);

// Current user
router.get('/me', userController.getCurrentUser);

export default router;