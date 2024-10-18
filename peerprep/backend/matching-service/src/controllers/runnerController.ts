import { Request, Response } from 'express';
import SessionObj from '../models/SessionObj';
import TimeOutObj from '../models/TimeOutObj';

class RunnerController {
    // Example usage: Start a session with a timeout
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

    // Example usage: Check for session expiration
    async checkSessionExpiration(req: Request, res: Response): Promise<void> {
        const { sessionId } = req.params;

        // Check if the session has expired
        const isExpired = await TimeOutObj.isExpired(sessionId);
        if (isExpired) {
            res.status(400).json({ message: 'Session expired.' });
        } else {
            res.status(200).json({ message: 'Session is still active.' });
        }
    }

    // Example usage: Cancel session timeout
    async cancelSession(req: Request, res: Response): Promise<void> {
        const { sessionId } = req.body;

        // Cancel the timeout and remove session from Redis
        await TimeOutObj.cancelTimeout(sessionId);
        res.status(200).json({ message: 'Session timeout cancelled.' });
    }
}

export default new RunnerController();

