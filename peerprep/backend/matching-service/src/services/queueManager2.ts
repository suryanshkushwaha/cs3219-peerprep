import { ChainableCommander } from 'ioredis';
import * as redis from '../utils/redisUtils3';

// Declare global timeout for matching
const MATCH_TIMEOUT_SECONDS = 30;

export const addToQueue = async (userId: string, topic: string, difficulty: string) => {
    console.log("FROM Queue: USER ID IS " + userId);
    console.log("FROM Queue: TOPIC IS " + topic);
    console.log("FROM Queue: DIFFICULTY IS " + difficulty);
    try {
      await redis.enqueueUser(userId, topic, difficulty, MATCH_TIMEOUT_SECONDS);
    } 
    catch (error) {
      const err = error as Error;
      if (err.name === "UserInQueueError" || err.name === "UserInSessionError") {
        throw error;
      }
      console.error('Error in addToQueue:', error);
      throw new Error("Failed to add user to the queue due to an unknown error");
    }
};


export const findMatchInQueue = async (userId: string)  => {
    const topicTimeoutSeconds = MATCH_TIMEOUT_SECONDS / 2;
    try {
      const match = await redis.findMatchInQueueByTopicAndDifficulty(userId);
      if (match) {
        return match;
      }
  
      const queueDuration = await redis.getQueueDurationSeconds(userId);
      //console.log("Queue Duration: " + queueDuration);
      //console.log("Topic Timeout: " + topicTimeoutSeconds);
  
      if (queueDuration !== null && queueDuration < topicTimeoutSeconds - 1) {
        return redis.findMatchInQueueByTopic(userId);
      }
  
      return null;
    } 
    catch (error) {
      console.error('Error in findMatchInQueue:', error);
      throw new Error("Failed to find a match for the user in the queue");
    }
}

// function to retrieve status of user match request from the queue as server side event
export const getRequestStatus = async (userId: string) => {
    try {
      return await redis.getRequestStatus(userId);
    } 
    catch (error) {
      console.error('Error in getRequestStatus:', error);
      throw new Error("Failed to retrieve the status of the user's match request");
    }
}

export const getSessionStatus = async (userId: string) => {
    try {
      const session = await redis.findSessionByUser(userId);
      return session ? session.sessionId : null;
    } 
    catch (error) {
      console.error('Error in getSessionStatus:', error);
      throw new Error("Failed to retrieve the status of the user's session");
    }
}

export const getStatus = async (userId: string) => {
    try {
      const sessionID = await getSessionStatus(userId);
      if (sessionID !== null) {
        return "matched on Session ID: " + sessionID;
      } else {
        const requestStatus = await getRequestStatus(userId);
        if (requestStatus !== null) {
          return requestStatus;
        }
        return "none";
      }
    } 
    catch (error) {
      console.error('Error in getStatus:', error);
      throw new Error("Failed to retrieve the status of the user's match request");
    }
}