import { ChainableCommander } from "ioredis";
import connectRedis from "../../config/redis";
import { Session } from "../models/Session";
import { Redis } from 'ioredis';
import app from '../server'; // Ensure this imports the Express app

/**
 * Sets a key-value pair in Redis with an optional expiration time (in seconds).
 * @param key - The key to store the data.
 * @param value - The value to be stored.
 * @param expirationInSeconds - Optional expiration time for the key.
 */
const set = async (
  key: string,
  value: string,
  expirationInSeconds?: number
): Promise<void> => {
  const redisClient: Redis = app.locals.redisClient;

  if (expirationInSeconds) {
    await redisClient.setex(key, expirationInSeconds, value);
  } else {
    await redisClient.set(key, value);
  }
};

/**
 * Retrieves a value by key from Redis.
 * @param key - The key for the data to retrieve.
 * @returns - The stored value or null if the key does not exist.
 */
const get = async (key: string): Promise<string | null> => {
  const redisClient: Redis = app.locals.redisClient;
  return await redisClient.get(key);
};

/**
 * Deletes a key from Redis.
 * @param key - The key to delete.
 * @returns - The number of keys that were removed.
 */
const del = async (key: string): Promise<number> => {
  const redisClient: Redis = app.locals.redisClient;
  return await redisClient.del(key);
};

/**
 * Checks if a key exists in Redis.
 * @param key - The key to check.
 * @returns - 1 if the key exists, 0 if the key does not exist.
 */
const exists = async (key: string): Promise<number> => {
  const redisClient: Redis = app.locals.redisClient;
  return await redisClient.exists(key);
};

/**
 * Sets a key-value pair in Redis only if the key does not already exist.
 * @param key - The key to store the data.
 * @param value - The value to store.
 * @returns - True if the key was set, false if it already exists.
 */
const setnx = async (key: string, value: string): Promise<boolean> => {
  const redisClient: Redis = app.locals.redisClient;
  const result = await redisClient.setnx(key, value);
  return result === 1; // Redis returns 1 if the key was set, 0 if it was not.
};

/**
 * Increments a value stored at a key.
 * @param key - The key whose value will be incremented.
 * @returns - The new value after incrementing.
 */
const incr = async (key: string): Promise<number> => {
  const redisClient: Redis = app.locals.redisClient;
  const newValue = await redisClient.incr(key);
  return newValue;
};

/**
 * Decrements a value stored at a key.
 * @param key - The key whose value will be decremented.
 * @returns - The new value after decrementing.
 */
const decr = async (key: string): Promise<number> => {
  const redisClient: Redis = app.locals.redisClient;
  const newValue = await redisClient.decr(key);
  return newValue;
};

// Should actually SCAN for queue keys and delete expired ones
export const clearExpiredQueue = async (
  topic: string,
  difficulty: string,
  queue_timeout_seconds: number
) => {
  const redisClient: Redis = app.locals.redisClient;
  const currentTime = Date.now();
  try {
    const queueKey = `queue:${topic}:${difficulty}`;
    await redisClient.zremrangebyscore('queue:users', 0, currentTime - queue_timeout_seconds);
    await redisClient.zremrangebyscore(queueKey, 0, currentTime - queue_timeout_seconds);
  } catch (error) {
    console.error("Error in clearExpiredQueue:", error);
    throw error;
  }
};

export const enqueueUser = async (
  userId: string,
  topic: string,
  difficulty: string,
  queue_timeout_seconds: number
) => {
  const redisClient: Redis = app.locals.redisClient;
  const timeStamp = Date.now();
  let multi = redisClient.multi();
  try {
    await clearExpiredQueue(topic, difficulty, queue_timeout_seconds);

    if (await checkIfUserInQueue(userId)) {
      throw new Error("User is already in queue");
    }
    if (await findSessionByUser(userId)) {
      throw new Error("User is already in a session");
    }

    
    multi.zadd("queue:users", timeStamp, userId);
    multi.hset(`queue:timestamp`, userId, timeStamp);
    multi.hset(`queue:topic`, userId, topic);
    multi.hset(`queue:difficulty`, userId, difficulty);

    multi.expire(`queue:timestamp`, queue_timeout_seconds);
    multi.expire(`queue:topic`, queue_timeout_seconds);
    multi.expire(`queue:difficulty`, queue_timeout_seconds);

    multi.zadd(`queue:${topic}:${difficulty}`, timeStamp, userId);
    multi.zadd(`queue:${topic}`, timeStamp, userId);
    multi.zadd(`queue:${difficulty}`, timeStamp, userId);

    await multi.exec();
  } catch (error) {
    console.error("Error in enqueueUser:", error);
    if (multi) {
      multi.discard();
    }
    throw error;
  }
};

export const getQueueDurationSeconds = async (
  userId: string
): Promise<number | null> => {
  const redisClient: Redis = app.locals.redisClient;
  try {
    const timeStamp = await redisClient.hget("queue:timestamp", userId);
    if (!timeStamp) {
      return null;
    }
    return (Date.now() - Number.parseInt(timeStamp)) / 1000;
  } catch (error) {
    console.error("Error in getQueueDurationSeconds:", error);
    throw error;
  }
};

export const checkIfUserInQueue = async (userId: string): Promise<boolean> => {
  const redisClient: Redis = app.locals.redisClient;
  try {
    const exists = await redisClient.zrank("queue:users", userId);
    return exists != null;
  } catch (error) {
    console.error("Error in checkIfUserInQueue:", error);
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

export const delSession = async (sessionId: string): Promise<void> => {
  const redisClient: Redis = app.locals.redisClient;
  try {
    const session = await findSession(sessionId);
    if (!session) {
      return;
    }
    const { userId1, userId2 } = session;
    const multi = redisClient.multi();
    multi.hdel(`session:userId`, userId1);
    multi.hdel(`session:userId`, userId2);
    multi.hdel(`session:sessionId`, sessionId);
    await multi.exec();
  } catch (error) {
    console.error("Error in delSession:", error);
    throw error;
  }
};

export const delSessionByUser = async (userId: string): Promise<void> => {
  const session = await findSessionByUser(userId);
  if (!session) {
    throw new Error("User is not in a session");
  }
  await delSession(session.sessionId);
};

export const findMatchInQueueByTopicAndDifficulty = async (
  userId: string
): Promise<string | null> => {
  const redisClient: Redis = app.locals.redisClient;
  try {
    const topic = await redisClient.hget("queue:topic", userId);
    const difficulty = await redisClient.hget("queue:difficulty", userId);
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
    return matchedUsers[0] === userId ? matchedUsers[1] : matchedUsers[0];
  } catch (error) {
    console.error("Error in findMatchInQueueByTopicAndDifficulty:", error);
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

export const deleteKeys = async (userId: string): Promise<void> => {
  const redisClient: Redis = app.locals.redisClient;
  try {
      await redisClient.del(`queue:timestamp:${userId}`);
      await redisClient.del(`queue:topic:${userId}`);
      await redisClient.del(`queue:difficulty:${userId}`);
      await redisClient.zrem("queue:users", userId);
  } catch (error) {
      console.error(`Error deleting Redis data for user ${userId}:`, error);
      throw error;
  }
};