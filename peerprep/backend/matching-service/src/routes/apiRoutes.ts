import express from 'express';
import { createRequest } from '../controllers/requestController';
import { matchStatusStream } from '../controllers/sseController'; // Import your SSE handler

const router = express.Router();

// Route for submitting a match request
router.post('/matchingrequest', createRequest);

// Route for Server-Sent Events (SSE) to check match status
router.get('/matchingrequest/:userId', matchStatusStream); // Change to use `:userId` as a URL parameter


export default router;