import { ChainableCommander } from "ioredis";
import connectRedis from "../../config/redis";
import { Session } from "../models/Session";
import { Redis } from 'ioredis';
import app from '../server'; // Ensure this imports the Express app

export const enqueueUser = async (
    userId: string,
    topic: string,
    difficulty: string,
    queue_timeout_seconds: number
  ) => {
    const redisClient: Redis = app.locals.redisClient;
    const timeStamp = Date.now();
    const expiryTime = timeStamp + queue_timeout_seconds * 1000;
    let multi = redisClient.multi();
    try {
      await clearExpiredQueue();
  
      console.log("USER ID IS " + userId);
      console.log("TOPIC IS " + topic);
      console.log("DIFFICULTY IS " + difficulty);
  
      if (await checkIfUserInQueue(userId)) {
        const error = new Error("User is already in queue");
        error.name = "UserInQueueError";
        throw error;
      }
      if (await findSessionByUser(userId)) {
        const error = new Error("User is already in a session");
        error.name = "UserInSessionError";
        throw error;
      }
      
  
      multi.zadd("queue:users", expiryTime, userId);
      multi.hset(`user-timestamp`, userId, expiryTime);
      multi.hset(`user-topic`, userId, topic);
      multi.hset(`user-difficulty`, userId, difficulty);
  
      multi.expire(`user-timestamp`, queue_timeout_seconds);
      multi.expire(`user-topic`, queue_timeout_seconds);
      multi.expire(`user-difficulty`, queue_timeout_seconds);
  
      multi.zadd(`queue:${topic}:${difficulty}`, expiryTime, userId);
      multi.zadd(`queue:${topic}`, expiryTime, userId);
      multi.zadd(`queue:${difficulty}`, expiryTime, userId);
  
      await multi.exec();
    } catch (error) {
      console.error("Error in enqueueUser:", error);
      if (multi) {
        multi.discard();
      }
      throw error;
    }
};

export const clearExpiredQueue = async () => {
    const redisClient: Redis = app.locals.redisClient;
    const expiredTime = Date.now();

    try {
        // Define the pattern to match all potential queue keys
        const pattern = "queue:*";
        let cursor = "0"; // Initialize the cursor for SCAN

        do {
            // Use SCAN to find keys matching the pattern
            const scanResult = await redisClient.scan(cursor, "MATCH", pattern, "COUNT", 100);
            cursor = scanResult[0]; // Update cursor position
            const keysToCheck = scanResult[1]; // List of keys returned by SCAN

            // Remove expired entries from each of these keys
            for (const key of keysToCheck) {
                const removedCount = await redisClient.zremrangebyscore(key, 0, expiredTime);
                if (removedCount > 0) {
                    console.log(`Removed ${removedCount} expired entries from ${key}`);
                }
            }
        } while (cursor !== "0"); // Continue until cursor returns to "0"
    } catch (error) {
        console.error("Error in clearExpiredQueue:", error);
        throw error;
    }
};
  
/*
export const clearExpiredQueue = async (
    topic: string,
    difficulty: string
  ) => {
    const redisClient: Redis = app.locals.redisClient;
    const expiredTime = Date.now();
  
    try {
      // Define all potential keys that should be checked for expired entries
      const keysToCheck = [
        `queue:users`,// -> we update this queue with other mechanisms!
        `queue:${topic}:${difficulty}`,
        `queue:${topic}`,
        `queue:${difficulty}`
      ];
  
      // Remove expired entries from each of these keys
      for (const key of keysToCheck) {
        // Check if deleted
        const removedCount = await redisClient.zremrangebyscore(key, 0, expiredTime);
        console.log(`Removed ${removedCount} expired entries from ${key}`);
      }
    } catch (error) {
      console.error("Error in clearExpiredQueue:", error);
      throw error;
    }
};
*/

export const checkIfUserInQueue = async (userId: string): Promise<boolean> => {
    const redisClient: Redis = app.locals.redisClient;
    try {
      // Check if the user exists in the sorted set "queue:users"
      const rank = await redisClient.zrank("queue:users", userId);
      return rank !== null;
    } catch (error) {
      console.error("Error in checkIfUserInQueue:", error);
      throw new Error("Failed to check if user is in the queue");
    }
};

export const findMatchInQueueByTopicAndDifficulty = async (
  userId: string
): Promise<String | null> => {
  const redisClient: Redis = app.locals.redisClient;
  try {
    const topic = await redisClient.hget("user-topic", userId);
    const difficulty = await redisClient.hget("user-difficulty", userId);
    if (!topic || !difficulty) {
      return null;
    }
    const matchedUsers = await redisClient.zrange(`queue:${topic}:${difficulty}`, 0, 2);
    if (
      matchedUsers.length === 0 ||
      (matchedUsers.length === 1 && matchedUsers[0] === userId)
    ) {
      return null;
    }
    //return matchedUsers[0] === userId ? matchedUsers[1] : matchedUsers[0];
    // Create session object
    try {
      const sessionId = createSession(userId, matchedUsers[0], topic, difficulty);
      return sessionId;
    } catch (error) {
        console.error("Error in createSession:", error);
        throw error;
    }
  } catch (error) {
    console.error("Error in findMatchInQueueByTopicAndDifficulty:", error);
    throw error;
  }
};

const createSession = async (
    userId1: string,
    userId2: string,
    topic: string,
    difficulty: string,
  ): Promise<String> =>{
    try {
      const session: Session = {
        sessionId: `${userId1}-${userId2}-${Date.now()}`,
        userId1,
        userId2,
        topic,
        difficulty,
        timestamp: Date.now(),
      };
      await saveSession(session);
      return session.sessionId;
    } catch (error) {
      console.error("Error in createSession:", error);
      throw error;
    }
  };

export const findMatchInQueueByTopic = async (
  userId: string
): Promise<string | null> => {
  const redisClient: Redis = app.locals.redisClient;
  try {
    const topic = await redisClient.hget("queue:topic", userId);
    if (!topic) {
      return null;
    }
    const matchedUsers = await redisClient.zrange(`queue:${topic}`, 0, 2);
    if (
      matchedUsers.length === 0 ||
      (matchedUsers.length === 1 && matchedUsers[0] === userId)
    ) {
      return null;
    }
    return matchedUsers[0] === userId ? matchedUsers[1] : matchedUsers[0];
  } catch (error) {
    console.error("Error in findMatchInQueueByTopic:", error);
    throw error;
  }
};

export const findMatchInQueueByDifficulty = async (
  userId: string
): Promise<string | null> => {
  const redisClient: Redis = app.locals.redisClient;
  try {
    const difficulty = await redisClient.hget("queue:difficulty", userId);
    if (!difficulty) {
      return null;
    }
    const matchedUsers = await redisClient.zrange(`queue:${difficulty}`, 0, 2);
    if (
      matchedUsers.length === 0 ||
      (matchedUsers.length === 1 && matchedUsers[0] === userId)
    ) {
      return null;
    }
    return matchedUsers[0] === userId ? matchedUsers[1] : matchedUsers[0];

  } catch (error) {
    console.error("Error in findMatchInQueueByDifficulty:", error);
    throw error;
  }
};

export const getQueueDurationSeconds = async (
    userId: string
  ): Promise<number | null> => {
    const redisClient: Redis = app.locals.redisClient;
    try {
      const timeStamp = await redisClient.hget("user-timestamp", userId);
      if (!timeStamp) {
        return null;
      }
      return (Number.parseInt(timeStamp) - Date.now()) / 1000;
    } catch (error) {
      console.error("Error in getQueueDurationSeconds:", error);
      throw error;
    }
};

export const getRequestStatus = async (userId: string): Promise<string> => {
    const redisClient: Redis = app.locals.redisClient;
    try {
      clearExpiredQueue();
      const status = await checkIfUserInQueue(userId);
      console.log("Status is: " + status);
      const duration = await getQueueDurationSeconds(userId);
      if (status) {
        return "Matching request pending: " + duration + " seconds remaining";
      } else {
        return "Matching request not in queue";
      }
    } catch (error) {
      console.error("Error in getRequestStatus:", error);
      throw error;
    }
};

export const saveSession = async (session: Session): Promise<void> => {
  const redisClient: Redis = app.locals.redisClient;
  const { userId1, userId2, sessionId } = session;
  try {
    const multi = redisClient.multi();
    multi.hset(`session:sessionId`, sessionId, JSON.stringify(session));
    multi.hset(`session:userId`, userId1, sessionId);
    multi.hset(`session:userId`, userId2, sessionId);
    await multi.exec();
  } catch (error) {
    console.error("Error in saveSession:", error);
    throw error;
  }
};

export const findSession = async (
  sessionId: string
): Promise<Session | null> => {
  const redisClient: Redis = app.locals.redisClient;
  try {
    const sessionString = await redisClient.hget(`session:sessionId`, sessionId);
    if (!sessionString) {
      return null;
    }
    return JSON.parse(sessionString);
  } catch (error) {
    console.error("Error in findSession:", error);
    throw error;
  }
};

export const findSessionByUser = async (
  userId: string
): Promise<Session | null> => {
  const redisClient: Redis = app.locals.redisClient;
  try {
    const sessionId = await redisClient.hget(`session:userId`, userId);
    if (!sessionId) {
      return null;
    }
    return findSession(sessionId);
  } catch (error) {
    console.error("Error in findSessionByUser:", error);
    throw error;
  }
};


