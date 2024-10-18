import connectRedis from '../../config/redis';

class SessionObj {
    private sessionId: string;
    private userId1: string;
    private userId2: string | null;
    private status: string;
    private createdAt: Date;

    constructor(sessionId: string, userId1: string) {
        this.sessionId = sessionId;
        this.userId1 = userId1;
        this.userId2 = null;
        this.status = 'waiting'; // Can be 'waiting', 'matched', 'expired'
        this.createdAt = new Date();
    }

    async save(): Promise<void> {
        const redisClient = await connectRedis(); // Connect to Redis
        const sessionData = JSON.stringify({
            userId1: this.userId1,
            userId2: this.userId2,
            status: this.status,
            createdAt: this.createdAt.toISOString(),
        });
        await redisClient.set(this.sessionId, sessionData);
    }

    static async find(sessionId: string): Promise<SessionObj | null> {
        const redisClient = await connectRedis(); // Connect to Redis
        const sessionData = await redisClient.get(sessionId);
        if (!sessionData) {
            return null;
        }

        const data = JSON.parse(sessionData);
        const session = new SessionObj(sessionId, data.userId1);
        session.userId2 = data.userId2;
        session.status = data.status;
        session.createdAt = new Date(data.createdAt);

        return session;
    }

    async updateStatus(status: string): Promise<void> {
        this.status = status;
        await this.save();
    }

    async addUser(userId2: string): Promise<void> {
        this.userId2 = userId2;
        this.status = 'matched';
        await this.save();
    }
}

export default SessionObj;
