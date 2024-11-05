import { Request, Response } from 'express';
import { addToQueue, removeFromQueue, cancelSession} from '../services/queueManager2';
import ReqObj from '../models/ReqObj';

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

export const deleteRequest = async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.userId as string; // Get userId from URL parameters
  
    try {
      // Try to remove the user from the queue
      console.log("Attempting to remove user from queue");
      await removeFromQueue(userId);
      res.status(200).json({ message: 'Request successfully removed from the queue' });
    } catch (error) {
      console.error("Error in deleteRequest:", error);
      res.status(500).json({ message: 'Failed to remove request from the queue due to an unknown error' });
    }
}

// API to delete a session
export const deleteSession = async (req: Request, res: Response): Promise<void> => {
  const sessionId = req.params.sessionId as string; // Get userId from URL parameters

  try {
    // Cancel the timeout and remove session from Redis
    await cancelSession(sessionId);
    res.status(200).json({ message: 'Session successfully deleted' });
  } catch (error) {
    console.error("Error in deleteSession:", error);
    res.status(500).json({ message: 'Failed to delete session due to an unknown error' });
  }
};