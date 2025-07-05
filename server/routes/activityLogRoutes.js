import express from 'express';
import { getTaskActivityLogs } from '../controllers/activityLogController.js';

const router = express.Router();

router.get('/:taskId', getTaskActivityLogs);

export default router;
