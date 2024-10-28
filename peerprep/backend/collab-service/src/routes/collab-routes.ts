import express from 'express';
import { createSession, getSession, endSession, processData } from '../controller/collab-controller';

const router = express.Router();

// Define routes for session management
router.post('/sessions', createSession);
router.get('/sessions/:sessionId', getSession);
router.delete('/sessions/:sessionId', endSession);

// POST endpoint to process incoming data
router.post('/process', (req, res) => {
    const { data } = req.body;
  
    // Example: Perform a simple operation on the incoming data
    const processedData = data.toUpperCase(); // Convert the incoming data to uppercase
  
    // Send the processed data back as a response
    res.json({ originalData: data, processedData });
  });
  

export default router;
