import express from 'express';
import { createSession, getSession, endSession } from '../controller/collab-controller';

const router = express.Router();

// Define routes for session management
router.post('/sessions', createSession);
router.get('/sessions/:sessionId', getSession);
router.delete('/sessions/:sessionId', endSession);

export default router;
