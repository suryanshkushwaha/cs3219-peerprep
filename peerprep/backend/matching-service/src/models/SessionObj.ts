import redisUtils from "../utils/redisUtils";

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
        this.startedAt = new Date(); // Set the current time for session start
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

    async save(): Promise<void> {
        const sessionData = JSON.stringify({
            userId1: this.userId1,
            userId2: this.userId2,
            topic: this.topic,
            difficulty: this.difficulty,
            sessionId: this.sessionId,
            startedAt: this.startedAt.toISOString(),
        });
        await redisUtils.set(this.sessionId, sessionData);
    }

    static async find(sessionId: string): Promise<Session | null> {
        const sessionData = await redisUtils.get(sessionId);
        if (!sessionData) {
            return null;
        }

        const data = JSON.parse(sessionData);
        const session = new Session(sessionId, data.userId1, data.topic, data.difficulty);
        session.userId2 = data.userId2;
        session.startedAt = new Date(data.startedAt);

        return session;
    }

    async addUser(userId2: string): Promise<void> {
        this.userId2 = userId2;
        await this.save();
    }
}

export default Session;
