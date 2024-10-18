import { Request, Response } from 'express';
import SessionObj from '../models/SessionObj';
import TimeOutObj from '../models/TimeOutObj';

class RunnerController {
    // Start a new session with a timeout for matching
    async startSession(req: Request, res: Response): Promise<void> {
        const { sessionId, userId1, timeoutDuration } = req.body;

        // Create new session
        const session = new SessionObj(sessionId, userId1);
        await session.save();

        // Set a timeout for this session
        const timeout = new TimeOutObj(sessionId, timeoutDuration);
        await timeout.startTimeout();

        res.status(200).json({ message: 'Session started and timeout set.' });
    }

    // Add a second user to the session and update the session status
    async addUserToSession(req: Request, res: Response): Promise<void> {
        const { sessionId, userId2 } = req.body;

        // Find session
        const session = await SessionObj.find(sessionId);
        if (!session) {
            res.status(404).json({ message: 'Session not found.' });
            return;
        }

        // Check if the session has expired
        const isExpired = await TimeOutObj.isExpired(sessionId);
        if (isExpired) {
            res.status(400).json({ message: 'Session expired.' });
            return;
        }

        // Add second user to the session and update the status
        await session.addUser(userId2);

        // Cancel the timeout since we have a match
        await TimeOutObj.cancelTimeout(sessionId);

        res.status(200).json({ message: 'User added and session matched.' });
    }

    // Check the status of a session
    async checkSessionStatus(req: Request, res: Response): Promise<void> {
        const { sessionId } = req.params;

        // Find session
        const session = await SessionObj.find(sessionId);
        if (!session) {
            res.status(404).json({ message: 'Session not found.' });
            return;
        }

        // Use getters to access private properties
        res.status(200).json({
            sessionId: sessionId,
            status: session.getStatus,     // Access the status using the getter
            userId1: session.getUserId1,   // Access userId1 using the getter
            userId2: session.getUserId2,   // Access userId2 using the getter
        });
    }

    // Cancel a session timeout and delete the session
    async cancelSession(req: Request, res: Response): Promise<void> {
        const { sessionId } = req.body;

        // Cancel the timeout and remove session from Redis
        await TimeOutObj.cancelTimeout(sessionId);

        res.status(200).json({ message: 'Session timeout cancelled.' });
    }
}

export default new RunnerController();

