import express from 'express';
import { createRequest, deleteRequest, deleteSession } from '../controllers/requestController2';
import { matchStatusStream } from '../controllers/sseController'; // Import your SSE handler

const router = express.Router();

// Route for submitting a match request
router.post('/matchingrequest', createRequest);

// Route for Server-Sent Events (SSE) to check match status
router.get('/matchingrequest/:userId', matchStatusStream); // Change to use `:userId` as a URL parameter

// Route to delete a matching request by userId
router.delete('/matchingrequest/:userId', deleteRequest);

// Route to delete a session by userId
router.delete('/matchingrequest/session/:sessionId', deleteSession);

export default router;