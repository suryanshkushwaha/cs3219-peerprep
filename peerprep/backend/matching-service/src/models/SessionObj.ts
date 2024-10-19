import redisUtils from '../utils/redisUtils';

export interface SessionObj {
    userId1: string;
    userId2: string;
    topic: string;
    difficulty: string;
    sessionId: string;
    startedAt: Date;
}

class Session {
    private sessionId: string;
    private userId1: string;
    private userId2: string | null;
    private topic: string;
    private difficulty: string;
    private startedAt: Date;

    constructor(sessionId: string, userId1: string, topic: string, difficulty: string) {
        this.sessionId = sessionId;
        this.userId1 = userId1;
        this.userId2 = null;
        this.topic = topic;
        this.difficulty = difficulty;
        this.startedAt = new Date();
    }

    // Getters for session properties
    get getSessionId(): string {
        return this.sessionId;
    }

    get getStatus(): string {
        return this.userId2 ? 'matched' : 'waiting';
    }

    get getUserId1(): string {
        return this.userId1;
    }

    get getUserId2(): string | null {
        return this.userId2;
    }

    get getTopic(): string {
        return this.topic;
    }

    get getDifficulty(): string {
        return this.difficulty;
    }

    // Save the session to Redis, abstracting away the Redis key management
    async save(): Promise<void> {
        const sessionData = {
            userId1: this.userId1,
            userId2: this.userId2,
            topic: this.topic,
            difficulty: this.difficulty,
            sessionId: this.sessionId,
            startedAt: this.startedAt.toISOString(),
        };
        await redisUtils.setSession(this.sessionId, sessionData); // Abstracted Redis key management
    }

    // Find a session by sessionId, abstracting away Redis key retrieval
    static async find(sessionId: string): Promise<Session | null> {
        const sessionData = await redisUtils.getSession(sessionId);
        if (!sessionData) {
            return null;
        }

        const session = new Session(sessionId, sessionData.userId1, sessionData.topic, sessionData.difficulty);
        session.userId2 = sessionData.userId2;
        session.startedAt = new Date(sessionData.startedAt);

        return session;
    }

    // Add a second user to the session and save to Redis
    async addUser(userId2: string): Promise<void> {
        this.userId2 = userId2;
        await this.save();
    }

    // Delete the session from Redis
    static async delete(sessionId: string): Promise<void> {
        await redisUtils.deleteSession(sessionId);
    }
}

export default Session;
