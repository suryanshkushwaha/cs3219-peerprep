import connectRedis from '../../config/redis';

class TimeOutObj {
    private sessionId: string;
    private timeoutDuration: number; // in seconds

    constructor(sessionId: string, timeoutDuration: number) {
        this.sessionId = sessionId;
        this.timeoutDuration = timeoutDuration;
    }

    // Start the timeout for the session
    async startTimeout(): Promise<void> {
        const redisClient = await connectRedis(); // Establish Redis connection
        await redisClient.setex(this.sessionId, this.timeoutDuration, 'waiting'); // 'waiting' status during timeout
    }

    // Check if a session has expired (i.e., if it's no longer in Redis)
    static async isExpired(sessionId: string): Promise<boolean> {
        const redisClient = await connectRedis(); // Establish Redis connection
        const status = await redisClient.get(sessionId);
        return status === null; // Return true if session data no longer exists
    }

    // Cancel the timeout (delete the session entry from Redis)
    static async cancelTimeout(sessionId: string): Promise<void> {
        const redisClient = await connectRedis(); // Establish Redis connection
        await redisClient.del(sessionId); // Remove session from Redis
    }
}

export default TimeOutObj;

