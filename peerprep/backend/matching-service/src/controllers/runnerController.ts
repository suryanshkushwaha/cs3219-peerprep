import { Request, Response } from 'express';
import Session from '../models/SessionObj';
import Timeout from '../models/TimeOutObj';

class RunnerController {
    // Start a new session with a timeout for matching
    async startSession(req: Request, res: Response): Promise<void> {
        const { sessionId, userId1, topic, difficulty, timeoutDuration } = req.body;

        // Create and save new session
        const session = new Session(sessionId, userId1, topic, difficulty);
        await session.save();

        // Start timeout for session
        const timeout = new Timeout(sessionId, timeoutDuration);
        await timeout.startTimeout();

        res.status(200).json({ message: 'Session started and timeout set.' });
    }

    // Add a second user to the session and update the session status
    async addUserToSession(req: Request, res: Response): Promise<void> {
        const { sessionId, userId2 } = req.body;

        // Find session
        const session = await Session.find(sessionId);
        if (!session) {
            res.status(404).json({ message: 'Session not found.' });
            return;
        }

        // Check if the session has expired
        const isExpired = await Timeout.isExpired(sessionId);
        if (isExpired) {
            res.status(400).json({ message: 'Session expired.' });
            return;
        }

        // Add second user to the session and update
        await session.addUser(userId2);

        // Cancel the timeout since we have a match
        await Timeout.cancelTimeout(sessionId);

        res.status(200).json({ message: 'User added and session matched.' });
    }

    // Check the status of a session
    async checkSessionStatus(req: Request, res: Response): Promise<void> {
        const { sessionId } = req.params;

        // Find session
        const session = await Session.find(sessionId);
        if (!session) {
            res.status(404).json({ message: 'Session not found.' });
            return;
        }

        // Return session details
        res.status(200).json({
            sessionId: session.getSessionId,
            status: session.getStatus,
            userId1: session.getUserId1,
            userId2: session.getUserId2,
            topic: session.getTopic,
            difficulty: session.getDifficulty
        });
    }

    // Cancel a session timeout
    async cancelSession(req: Request, res: Response): Promise<void> {
        const { sessionId } = req.body;

        // Cancel the timeout and remove session from Redis
        await Timeout.cancelTimeout(sessionId);

        res.status(200).json({ message: 'Session timeout cancelled.' });
    }
}

export default new RunnerController();
