import express, { Router } from 'express';
import * as projectController from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';
import { validate, projectSchema } from '../middleware/validation.js';

const router: Router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create project (any authenticated user)
router.post('/', validate(projectSchema), projectController.createProject);

// Get all projects
router.get('/', projectController.getProjects);

// Get project by ID
router.get('/:id', projectController.getProjectById);

// Admin only routes
router.use(requireAdmin);

// Update project (admin only)
router.patch('/:id', validate(projectSchema), projectController.updateProject);

// Delete project (admin only, soft delete)
router.delete('/:id', projectController.deleteProject);

// Restore project (admin only)
router.patch('/restore/:id',  projectController.restoreProject);

// Permanently delete project (admin only)
router.delete('/permanent/:id',  projectController.permanentDeleteProject);
export default router;