import { ChainableCommander } from 'ioredis';
import * as redis from '../utils/redisUtils2';

// Declare global timeout for matching
const MATCH_TIMEOUT_SECONDS = 30;

/**
 * Add a user to the queue.
 * @param userId - The ID of the user to be added.
 * @param topic - The topic preference for the match.
 * @param difficulty - The difficulty preference for the match.
 */
export const addToQueue = async (userId: string, topic: string, difficulty: string) => {
  console.log("FROM Queue: USER ID IS" + userId);
  console.log("FROM Queue: TOPIC IS" + topic);
  console.log("FROM Queue: DIFFICULTY IS" + difficulty);
  try {
    // Use the utility function to enqueue the user
    await redis.enqueueUser(userId, topic, difficulty, MATCH_TIMEOUT_SECONDS);
  } catch (error) {
    console.error('Error in addToQueue:', error);
    throw error;
  }
};

/**
 * Find a match for a user in the queue.
 * @param userId - The ID of the user to find a match for.
 * @returns The matched user ID or null if no match is found.
 */
export const findMatchInQueue = async (userId: string) => {
  // After half of the MATCH_TIMEOUT_SECONDS, consider matching by topic only
  const topicTimeoutSeconds = MATCH_TIMEOUT_SECONDS / 2;
  try {
    const match = await redis.findMatchInQueueByTopicAndDifficulty(userId);
    if (match) {
      return match;
    }

    const queueDuration = await redis.getQueueDurationSeconds(userId);

    // If the user has been in the queue longer than half the timeout, relax the matching criteria
    if (queueDuration !== null && queueDuration > topicTimeoutSeconds) {
      return redis.findMatchInQueueByTopic(userId);
    }

    return null;
  } catch (error) {
    console.error('Error in findMatchInQueue:', error);
    throw error;
  }
};

/**
 * Delete a user's match request from the queue.
 * @param userId - The ID of the user to remove.
 */
export const deleteRequest = async (userId: string) => {
  try {
    await redis.deleteKeys(userId);
    console.log(`Request for user ${userId} successfully deleted.`);
  } catch (error) {
    console.error(`Error deleting request for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Save a matched session between two users.
 * @param userId1 - The first user in the session.
 * @param userId2 - The second user in the session.
 * @param topic - The topic of the session.
 * @param difficulty - The difficulty of the session.
 * @param sessionId - A unique identifier for the session.
 */
export const saveSession = async (
  userId1: string,
  userId2: string,
  topic: string,
  difficulty: string,
  sessionId: string
) => {
  try {
    const session = {
      sessionId,
      userId1,
      userId2,
      topic,
      difficulty,
      timestamp: Date.now(),
    };
    await redis.saveSession(session);
    console.log(`Session between ${userId1} and ${userId2} saved successfully.`);
  } catch (error) {
    console.error('Error in saveSession:', error);
    throw error;
  }
};
