import { Request, Response } from 'express';
import { addToQueue} from '../services/queueManager2';
import ReqObj from '../models/ReqObj';

// Backend API for accpting a new matching request
// POST /matchingrequest
// Check if the user is already in the queue or in an active session
// If not, user is added to the queue and 200 ok response is sent
// NOTE: Matching is not handled here, this is to just succesfully enter a match request

export const createRequest = async (req: Request, res: Response): Promise<void> => {
    const { userId, topic, difficulty } = req.body;
  
    const newRequest: ReqObj = {
      userId,
      topic,
      difficulty,
      status: 'pending',
      createdAt: new Date(),
    };
  
    try {
      // Try to add the user to the queue
      await addToQueue(userId, topic, difficulty);
      res.status(200).json({ message: 'Request successfully added to the queue' });
      // Match user
      
    } catch (error) {
      const err = error as Error;
      if (err.name === "UserInQueueError") {
        res.status(409).json({ message: 'User is already in the queue' });
      } else if (err.name === "UserInSessionError") {
        res.status(409).json({ message: 'User is already in an active session' });
      } else {
        console.error("Error in createRequest:", err);
        res.status(500).json({ message: 'Failed to add request to the queue due to an unknown error' });
      }
    }
  };