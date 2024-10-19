import redisUtils from '../utils/redisUtils';

export interface TimeOutObj {
    userId: string;
    expiresAt: Date;
}

class Timeout {
    private sessionId: string;
    private timeoutDuration: number; // in seconds
    private expiresAt: Date;

    constructor(sessionId: string, userId: string, timeoutDuration: number) {
        this.sessionId = sessionId;
        this.timeoutDuration = timeoutDuration;
        this.expiresAt = new Date(Date.now() + timeoutDuration * 1000); // Calculate expiration date
    }

    // Start the timeout for the session, store with an expiration in Redis
    async startTimeout(): Promise<void> {
        const timeoutData: TimeOutObj = {
            userId: this.sessionId,
            expiresAt: this.expiresAt
        };
        await redisUtils.set(this.sessionId, JSON.stringify(timeoutData), this.timeoutDuration);
    }

    // Check if a session has expired by checking if the session exists in Redis
    static async isExpired(sessionId: string): Promise<boolean> {
        const timeoutData = await redisUtils.get(sessionId);
        return timeoutData === null; // If the key doesn't exist, it has expired
    }

    // Cancel the timeout (delete the session entry from Redis)
    static async cancelTimeout(sessionId: string): Promise<void> {
        await redisUtils.del(sessionId);
    }
}

export default Timeout;
