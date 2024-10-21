import { ChainableCommander } from 'ioredis';
import * as redis from '../utils/redisUtils';

// Push user
export const addToQueue = async (userId: string, topic: string, difficulty: string, timeoutSeconds: number) => {
  try {
    await redis.enqueueUser(userId, topic, difficulty, timeoutSeconds);
  } catch (error) {
    console.error('Error in addToQueue:', error);
    throw error;
  }
};

// Find user match
export const findMatchInQueue = async (userId: string, timeoutSeconds: number) => {
  // After this time, the user will be matched with any other user (same topic, different difficulty)
  const topicTimeoutSeconds = timeoutSeconds / 2; 
  try {
    const match = await redis.findMatchInQueueByTopicAndDifficulty(userId);
    if (match) {
      return match;
    }
    
    const queueDuration = await redis.getQueueDurationSeconds(userId);

    if (queueDuration !== null && queueDuration > topicTimeoutSeconds) {
      return redis.findMatchInQueueByTopic(userId);
    }

  } catch (error) {
    console.error('Error in findMatchInQueue:', error);
    throw error;
  }
};
