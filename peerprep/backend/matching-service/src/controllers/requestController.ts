import { Request, Response } from 'express';
import { addToQueue, findMatchInQueue } from '../services/queueManager';
//import { redisDelete } from '../utils/redisUtils';
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
        // Wait one second before checking againe
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (matchedUser) {
        res.status(200).json({ message: 'Match found', data: matchedUser });
    } else {
        //await redisDelete(newRequest.userId); // Remove request if no match
        res.status(408).json({ message: 'No match found, request timed out' });
    }
};
/*
import { Request, Response } from 'express';
import { addToQueue } from '../services/queueManager';
import ReqObj from '../models/ReqObj';

// Create a new matching request
export const createRequest = async (req: Request, res: Response): Promise<void> => {
    const { userId, topic, difficulty } = req.body;

    // Construct request object
    const newRequest: ReqObj = {
        userId,
        topic,
        difficulty,
        status: 'pending',
        createdAt: new Date(),
    };

    console.log("FROM CONTROLLER: USER ID IS" + userId);
    console.log("FROM CONTROLLER: TOPIC IS" + topic);
    console.log("FROM CONTROLLER: DIFFICULTY IS" + difficulty);

    // Add the user to the queue
    try {
        await addToQueue(userId, topic, difficulty);
        res.status(201).json({ message: 'Match request created successfully', data: newRequest });
    } catch (error) {
        console.error('Error adding to queue:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
*/
        