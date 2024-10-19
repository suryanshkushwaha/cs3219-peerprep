import { ChainableCommander } from 'ioredis';
import * as redis from '../utils/redisUtils';

const QUEUE_TIMEOUT = 30000; // ms

// After this timeout, allow the user to be matched with a different difficulty level
const QUEUE_TOPIC_TIMEOUT = 15000; // ms

// Push user
export const addToQueue = async (userId: string, topic: string, difficulty: string) => {
  try {
    await redis.enqueueUser(userId, topic, difficulty, QUEUE_TIMEOUT/1000);
  } catch (error) {
    console.error('Error in addToQueue:', error);
    throw error;
  }
};

// Find user match
export const findMatchInQueue = async (userId: string) => {
  try {
    const match = await redis.findMatchInQueueByTopicAndDifficulty(userId);
    if (match) {
      return match;
    }
    
    const queueDuration = await redis.getQueueDurationSeconds(userId);

    if (queueDuration !== null && queueDuration > QUEUE_TOPIC_TIMEOUT) {
      return redis.findMatchInQueueByTopic(userId);
    }

  } catch (error) {
    console.error('Error in findMatchInQueue:', error);
    throw error;
  }
};
