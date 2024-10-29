import express from 'express';
import { createRequest } from '../controllers/requestController2';
import { getSessionById } from '../controllers/runnerController';
import { matchStatusStream } from '../controllers/sseController'; // Import your SSE handler

const router = express.Router();

// Route for submitting a match request
router.post('/matchingrequest', createRequest);

// Route for Server-Sent Events (SSE) to check match status
router.get('/matchingrequest/:userId', matchStatusStream); // Change to use `:userId` as a URL parameter

// Define the route for getting a session by sessionId
router.get('/session/:sessionId', getSessionById);

export default router;