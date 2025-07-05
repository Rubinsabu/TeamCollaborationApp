import express from 'express';
import {createTask, updateTask, moveTask, reassignTask, deleteTask, addComment, getTaskDetails} from '../controllers/taskController.js';
import {isAdminOfProject} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',createTask);
router.put('/:id', updateTask);
router.put('/:id/move', moveTask);
router.get('/:id',getTaskDetails);
router.post('/:id/comments',addComment);
router.put('/:id/reassign', isAdminOfProject, reassignTask);
router.delete('/:id', isAdminOfProject,deleteTask);

export default router;