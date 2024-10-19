import connectRedis from '../../config/redis';

const redisUtils = {
    // Set session in Redis with session ID as the key
    async setSession(sessionId: string, sessionData: any): Promise<void> {
        const redisClient = await connectRedis();
        await redisClient.set(sessionId, JSON.stringify(sessionData));
    },

    // Get session from Redis by session ID
    async getSession(sessionId: string): Promise<any | null> {
        const redisClient = await connectRedis();
        const sessionData = await redisClient.get(sessionId);
        return sessionData ? JSON.parse(sessionData) : null;
    },

    // Delete session from Redis by session ID
    async deleteSession(sessionId: string): Promise<void> {
        const redisClient = await connectRedis();
        await redisClient.del(sessionId);
    },

    // Set timeout in Redis with expiration
    async setTimeout(sessionId: string, timeoutData: any, expirationInSeconds: number): Promise<void> {
        const redisClient = await connectRedis();
        await redisClient.setex(sessionId, expirationInSeconds, JSON.stringify(timeoutData));
    },

    // Get timeout from Redis by session ID
    async getTimeout(sessionId: string): Promise<any | null> {
        const redisClient = await connectRedis();
        const timeoutData = await redisClient.get(sessionId);
        return timeoutData ? JSON.parse(timeoutData) : null;
    },

    // Delete timeout from Redis by session ID
    async deleteTimeout(sessionId: string): Promise<void> {
        const redisClient = await connectRedis();
        await redisClient.del(sessionId);
    }
};

export default redisUtils;
