import express from 'express';
import { createSession, getSession, endSession, processData } from '../controller/collab-controller';

const router = express.Router();

// Define routes for session management
router.post('/sessions', createSession);
router.get('/sessions/:sessionId', getSession);
router.delete('/sessions/:sessionId', endSession);

// Route for processing data
router.post('/process-data', processData);

export default router;
