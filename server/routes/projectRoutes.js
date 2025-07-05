import express from 'express';
import { createProject, addMember, removeMember, getProjectTasks, getUserProjects, getProjectWithUsers } from '../controllers/projectController.js';

const router = express.Router();

router.post('/', createProject);
router.post('/:projectId/add-member', addMember);
router.put('/:projectId/remove-member', removeMember);
router.get('/', getUserProjects);
router.get('/:id/projectUsers',getProjectWithUsers);
router.get('/:projectId/tasks', getProjectTasks);

export default router;