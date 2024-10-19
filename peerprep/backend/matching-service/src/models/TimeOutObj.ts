import redisUtils from '../utils/redisUtils';

export interface TimeOutObj {
    userId: string;
    expiresAt: Date;
}

class Timeout {
    private sessionId: string;
    private expiresAt: Date;

    constructor(sessionId: string, timeoutDuration: number) {
        this.sessionId = sessionId;
        this.expiresAt = new Date(Date.now() + timeoutDuration * 1000); // Calculate expiration time
    }

    // Start the timeout for a session, saving the timeout to Redis
    async startTimeout(): Promise<void> {
        const timeoutData: TimeOutObj = {
            userId: this.sessionId, // Assuming sessionId acts as userId for simplicity
            expiresAt: this.expiresAt
        };
        await redisUtils.setTimeout(this.sessionId, timeoutData, Math.floor((this.expiresAt.getTime() - Date.now()) / 1000)); // Redis handles expiration
    }

    // Check if a session has expired by checking Redis
    static async isExpired(sessionId: string): Promise<boolean> {
        const timeoutData = await redisUtils.getTimeout(sessionId);
        return timeoutData === null; // Expired if no data in Redis
    }

    // Cancel the timeout (delete the session entry from Redis)
    static async cancelTimeout(sessionId: string): Promise<void> {
        await redisUtils.deleteTimeout(sessionId);
    }
}

export default Timeout;
