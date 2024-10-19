import { Request, Response } from 'express';
import { addToQueue, findMatchInQueue } from '../services/queueManager';
import { redisDelete } from '../utils/redisUtils';
import ReqObj from '../models/ReqObj';

// new request
export const createRequest = async (req: Request, res: Response): Promise<void> => {
    const { userId, topic, difficulty } = req.body;

    const newRequest: ReqObj = {
        userId,
        topic,
        difficulty,
        status: 'pending',
        createdAt: new Date(),
    };


    await addToQueue(userId, topic, difficulty);

    // find within 30 seconds
    let matchedUser = null;
    const timeout = 30000;
    const startTime = Date.now();

    while (!matchedUser && Date.now() - startTime < timeout) {
        matchedUser = await findMatchInQueue(userId);

        if (matchedUser) {
            break;
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (matchedUser) {
        res.status(200).json({ message: 'Match found', data: matchedUser });
    } else {
        await redisDelete(newRequest.userId); // Remove request if no match
        res.status(408).json({ message: 'No match found, request timed out' });
    }
};
