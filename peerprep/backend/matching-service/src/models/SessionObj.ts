import redisUtils from '../utils/redisUtils';

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

    // Getters for private properties
    get getStatus(): string {
        return this.status;
    }

    get getUserId1(): string {
        return this.userId1;
    }

    get getUserId2(): string | null {
        return this.userId2;
    }

    async save(): Promise<void> {
        const sessionData = JSON.stringify({
            userId1: this.userId1,
            userId2: this.userId2,
            status: this.status,
            createdAt: this.createdAt.toISOString(),
        });
        await redisUtils.set(this.sessionId, sessionData);
    }

    static async find(sessionId: string): Promise<SessionObj | null> {
        const sessionData = await redisUtils.get(sessionId);
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

