import { ChainableCommander } from "ioredis";
import axios from 'axios';
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
  
      //console.log("USER ID IS " + userId);
      //console.log("TOPIC IS " + topic);
      //console.log("DIFFICULTY IS " + difficulty);
  
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
      
  
      multi.zadd("queue2:users", expiryTime, userId);
      multi.hset(`user-timestamp`, userId, expiryTime);
      multi.hset(`user-topic`, userId, topic);
      multi.hset(`user-difficulty`, userId, difficulty);
  
      multi.expire(`user-timestamp`, queue_timeout_seconds);
      multi.expire(`user-topic`, queue_timeout_seconds);
      multi.expire(`user-difficulty`, queue_timeout_seconds);
  
      multi.zadd(`queue1:${topic}:${difficulty}`, expiryTime, userId);
      //multi.zadd(`queue2:${topic}`, expiryTime, userId);
      //multi.zadd(`queue2:${difficulty}`, expiryTime, userId);
  
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
  const expiredTime15 = Date.now() + 15 * 1000;

  try {
      // Define the patterns to match keys
      const patternQueue1 = "queue1:*";
      const patternQueue2 = "queue2:*";
      let cursor = "0"; // Initialize the cursor for SCAN

      do {
        // Use SCAN to find keys matching the patterns
        const scanResult1 = await redisClient.scan(cursor, "MATCH", patternQueue1, "COUNT", 100);
        cursor = scanResult1[0]; // Update cursor position
        const queue1Keys = scanResult1[1]; // List of queue1 keys
    
        // Check for expired entries and move them to queue2
        for (const key of queue1Keys) {
            const topicAndDifficulty = key.split(":").slice(1); // Extract topic and difficulty
            const [topic] = topicAndDifficulty; // Extract only the topic part
    
            // Get expired entries from queue1 key
            //const expiredEntries = await redisClient.zrangebyscore(key, 0, expiredTime15);
            const expiredEntries = await redisClient.zrangebyscore(key, 0, expiredTime15, "WITHSCORES");
    
            if (expiredEntries.length > 0) {
                /*
                // Remove expired entries from queue1 key
                const removedCount = await redisClient.zremrangebyscore(key, 0, expiredTime15);
                console.log(`Removed ${removedCount} expired entries from ${key}`);
    
                // Add expired entries to queue2
                const newKey = `queue2:${topic}`;
                for (const entry of expiredEntries) {
                    await redisClient.zadd(newKey, expiredTime, entry);
                    console.log(`Added expired entry ${entry} to ${newKey}`);
                }
                */
              // Remove expired entries from queue1 key
              const removedCount = await redisClient.zremrangebyscore(key, 0, expiredTime15);
              console.log(`Removed ${removedCount} expired entries from ${key}`);

              // Add expired entries to queue2, preserving their expiry time
              const newKey = `queue2:${topic}`;
              for (let i = 0; i < expiredEntries.length; i += 2) {
                const userId = expiredEntries[i];
                const originalExpiryTime = expiredEntries[i + 1];
                await redisClient.zadd(newKey, originalExpiryTime, userId);
                console.log(`Added expired entry ${userId} to ${newKey} with expiry time ${originalExpiryTime}`);
              }
            }
        }

        // Repeat similar scanning for queue2 keys but without moving them
        const scanResult2 = await redisClient.scan(cursor, "MATCH", patternQueue2, "COUNT", 100);
        cursor = scanResult2[0]; // Update cursor position
        const queue2Keys = scanResult2[1]; // List of queue2 keys
    
        // Just remove expired entries from queue2 keys
        for (const key of queue2Keys) {
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
export const clearExpiredQueue = async () => {
    const redisClient: Redis = app.locals.redisClient;
    const expiredTime = Date.now();

    try {
        // Define the pattern to match all potential queue keys
        const pattern = "queue1:*";
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
*/
  
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
      const rank = await redisClient.zrank("queue2:users", userId);
      return rank !== null;
    } catch (error) {
      console.error("Error in checkIfUserInQueue:", error);
      throw new Error("Failed to check if user is in the queue");
    }
};

export const findMatchInQueue = async (
  userId: string
): Promise<String | null> => {
  const redisClient: Redis = app.locals.redisClient;
  try {
    const topic = await redisClient.hget("user-topic", userId);
    const difficulty = await redisClient.hget("user-difficulty", userId);
    const time = await redisClient.hget("user-timestamp", userId);
    // Convert linux time to seconds to find time remeaining
    if (!time) {
      return null;
    }
    const timeRemaining = (Number.parseInt(time) - Date.now()) / 1000;

    if (!topic || !difficulty) {
      return null;
    }
    if (timeRemaining > 16) {
      const matchedUsers = await redisClient.zrange(`queue1:${topic}:${difficulty}`, 0, 2);
      if (
        matchedUsers.length === 0 || matchedUsers.length === 1 ||
        (matchedUsers.length === 2 && matchedUsers[0] === userId && matchedUsers[1] === userId)
      ) {
        return null;
      }
      const userId2 = (matchedUsers[0] === userId ? matchedUsers[1] : matchedUsers[0]);
      //console.log("USER ID 1 IS " + userId);
      //console.log("USER ID 2 IS " + userId2);
      try {
        const sessionId = createSession(userId, userId2, topic, difficulty);
        return sessionId;
      } catch (error) {
          console.error("Error in createSession:", error);
          throw error;
      }
    }
    if (timeRemaining < 14) {
      const matchedUsers = await redisClient.zrange(`queue2:${topic}`, 0, 2);
      if (
        matchedUsers.length === 0 || matchedUsers.length === 1 ||
        (matchedUsers.length === 2 && matchedUsers[0] === userId && matchedUsers[1] === userId)
      ) {
        return null;
      }
      const userId2 = (matchedUsers[0] === userId ? matchedUsers[1] : matchedUsers[0]);
      //console.log("USER ID 1 IS " + userId);
      //console.log("USER ID 2 IS " + userId2);
      try {
        const sessionId = createSession(userId, userId2, topic, difficulty);
        return sessionId;
      } catch (error) {
          console.error("Error in createSession:", error);
          throw error;
      }
    }
    return null;
  } catch (error) {
    console.error("Error in findMatchInQueueByTopicAndDifficulty:", error);
    throw error;
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
    const matchedUsers = await redisClient.zrange(`queue1:${topic}:${difficulty}`, 0, 2);
    if (
      matchedUsers.length === 0 || matchedUsers.length === 1 ||
      (matchedUsers.length === 2 && matchedUsers[0] === userId && matchedUsers[1] === userId)
    ) {
      return null;
    }
    const userId2 = matchedUsers[0] === userId ? matchedUsers[1] : matchedUsers[0];
    try {
      const sessionId = createSession(userId, userId2, topic, difficulty);
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
  ): Promise<string> =>{
    const sessionId = "lol";
    try {
      let sessionId = `${userId1}-${userId2}-${Date.now()}-Q`;
      
      /* RANDOM QUESTION STARTS HERE */
      const randomQuestion = await getRandomQuestionFromQuestionService(topic, difficulty);
      const randomQuestionTitle = randomQuestion?.title.replace(/ /g, "-");
      sessionId += randomQuestionTitle
      console.log("UPDATED Session ID:", sessionId);
      
      const session: Session = {
        sessionId: sessionId,
        userId1,
        userId2,
        topic,
        difficulty,
        timestamp: Date.now(),
      };

      await saveSession(session);
      // return sessionId as string
      // convert to string to match the return type
      return sessionId;
    } catch (error) {
      console.error("Error in createSession:", error);
      throw error;
    }
  };

  export const getRandomQuestionFromQuestionService = async (topic: string, difficulty: string) => {
    try {
      //const response = await axios.get(`http://localhost:8080/api/questions/random-question`, {
      const response = await axios.get(`http://question-service:8080/api/questions/random-question`, {
        params: { topic, difficulty }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching random question from question-service:', error);
      throw new Error('Failed to fetch random question from question service');
    }
  };

export const findMatchInQueueByTopic = async (
  userId: string
): Promise<String | null> => {
  const redisClient: Redis = app.locals.redisClient;
  try {
    const topic = await redisClient.hget("user-topic", userId);
    const difficulty = await redisClient.hget("user-difficulty", userId);
    if (!topic || !difficulty) {
      return null;
    }
    const matchedUsers = await redisClient.zrange(`queue2:${topic}`, 0, 2);
    if (
      matchedUsers.length === 0 || matchedUsers.length === 1 ||
      (matchedUsers.length === 2 && matchedUsers[0] === userId && matchedUsers[1] === userId)
    ) {
      return null;
    }
    const userId2 = matchedUsers[0] === userId ? matchedUsers[1] : matchedUsers[0];

    try {
      const sessionId = createSession(userId, userId2, topic, difficulty);
      return sessionId;
    } catch (error) {
        console.error("Error in createSession:", error);
        throw error;
    }
  } catch (error) {
    console.error("Error in findMatchInQueueByTopic:", error);
    throw error;
  }
};

/*
export const findMatchInQueueByDifficulty = async (
  userId: string
): Promise<string | null> => {
  const redisClient: Redis = app.locals.redisClient;
  try {
    const difficulty = await redisClient.hget("user-difficulty", userId);
    if (!difficulty) {
      return null;
    }
    const matchedUsers = await redisClient.zrange(`queue2:${difficulty}`, 0, 2);
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
*/

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
      console.log("User " + userId + " is in queue: " + status);
      const duration = await getQueueDurationSeconds(userId);
      if (status) {
        return "Matching request pending: " + Math.trunc(duration!) + " seconds remaining";
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

  //
  // Log State of all queues before a match
  //
  console.log("\n" + "Queues before match attempt");
  const queues = await redisClient.keys("queue*");
  for (const queue of queues) {
    const queueType = await redisClient.type(queue);
    if (queueType === "zset") {
      const members = await redisClient.zrange(queue, 0, -1, "WITHSCORES");
      console.log("\n" + `Queue ${queue} before match:`);
      // Print all memebers and their index in queue
      for (let i = 0; i < members.length; i += 2) {
        console.log(`User ${members[i]} at index ${i / 2}`);
      }
    }
  }

  console.log("\n" + "Sessions before match attempt");
  const sessions = await redisClient.keys("session*");
  for (const session of sessions) {
    const sessionData = await redisClient.hgetall(session);
    console.log("\n" + `Session ${session}:`);
    console.log(`${JSON.stringify(sessionData)}`)
  }

  try {
    const multi = redisClient.multi();
    multi.hset(`session:sessionId`, sessionId, JSON.stringify(session));
    multi.hset(`session:userId`, userId1, sessionId);
    multi.hset(`session:userId`, userId2, sessionId);
    // remove corresponding users from queue
    const topic = session.topic;
    const difficulty = session.difficulty;
    multi.zrem(`queue2:users`, userId1);
    multi.zrem(`queue2:users`, userId2);
    // NOTE: Zrem exectes without errors even if the user is not in the queue
    multi.zrem(`queue1:${topic}:${difficulty}`, userId1);
    multi.zrem(`queue1:${topic}:${difficulty}`, userId2);
    // NOTE: We only check session topic and difficulty
    // If users were amtched based on topic (with different difficulties), we remove them from ONLY the topic queue
    // as they have already been deleted from the topic+difficulty queue
    multi.zrem(`queue2:${topic}`, userId1);
    multi.zrem(`queue2:${topic}`, userId2);
    await multi.exec();

    //
    // Log State of all queues after a match
    //
    console.log("\n" + "Queues after match");
    const queues = await redisClient.keys("queue*");
    for (const queue of queues) {
      const queueType = await redisClient.type(queue);
      if (queueType === "zset") {
        const members = await redisClient.zrange(queue, 0, -1, "WITHSCORES");
        console.log("\n" + `Queue ${queue} after match:`);
        // Print all memebers and their index in queue
        for (let i = 0; i < members.length; i += 2) {
          console.log(`User ${members[i]} at index ${i / 2}`);
        }
      }
    }

    console.log("\n" + "Sessions after match");
    const sessions = await redisClient.keys("session*");
    for (const session of sessions) {
      const sessionData = await redisClient.hgetall(session);
      console.log("\n" + `Session ${session}:`);
      console.log(`${JSON.stringify(sessionData)}`)
    }
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


