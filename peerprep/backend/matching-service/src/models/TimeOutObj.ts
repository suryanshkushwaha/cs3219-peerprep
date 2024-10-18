import redisUtils from '../utils/redisUtils';

class TimeOutObj {
    private sessionId: string;
    private timeoutDuration: number; // in seconds

    constructor(sessionId: string, timeoutDuration: number) {
        this.sessionId = sessionId;
        this.timeoutDuration = timeoutDuration;
    }

    // Start the timeout for the session, store with an expiration in Redis
    async startTimeout(): Promise<void> {
        await redisUtils.set(this.sessionId, 'waiting', this.timeoutDuration);
    }

    // Check if a session has expired by checking if the session exists in Redis
    static async isExpired(sessionId: string): Promise<boolean> {
        const status = await redisUtils.get(sessionId);
        return status === null; // If the key doesn't exist, it has expired
    }

    // Cancel the timeout (delete the session entry from Redis)
    static async cancelTimeout(sessionId: string): Promise<void> {
        await redisUtils.del(sessionId);
    }
}

export default TimeOutObj;


