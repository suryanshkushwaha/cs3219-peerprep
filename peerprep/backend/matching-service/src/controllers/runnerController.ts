/*
import { Request, Response } from "express";
import { Session } from "../models/Session";
import { addToQueue, findMatchInQueue } from "../services/queueManager";
import * as redis from "../utils/redisUtils";

// Start a new session with a timeout for matching
export const startSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    userId,
    topic,
    difficulty,
    matchTimeoutSeconds,
    sessionTimeoutSeconds,
  } = req.body;

  // Check if required variables are set
  if (
    !userId ||
    !topic ||
    !difficulty ||
    !matchTimeoutSeconds ||
    !sessionTimeoutSeconds
  ) {
    res.status(400).json({ message: "Missing required parameters" });
    return;
  }

  try {
    await enqueueUser(userId, topic, difficulty, matchTimeoutSeconds);
    
    // Start the matching and session creation process asynchronously
    handleMatchingAndSessionCreation(userId, topic, difficulty, matchTimeoutSeconds);

    // Respond to the client immediately
    res.status(200).json({ message: "Matching process initiated." });
  } catch (error) {
    console.error("Error in startSession:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleMatchingAndSessionCreation = async (
  userId: string,
  topic: string,
  difficulty: string,
  matchTimeoutSeconds: number,
): Promise<void> => {
  try {
    const userId2 = await waitAndMatch(userId, matchTimeoutSeconds);
    if (userId2 === null || userId2 === undefined) {
      console.log(`No match found for user ${userId}`);
      return;
    }
    await createSession(
      userId,
      userId2,
      topic,
      difficulty,
    );
    console.log(`Session created for users ${userId} and ${userId2}`);
  } catch (error) {
    console.error("Error in handleMatchingAndSessionCreation:", error);
  }
};

const enqueueUser = async (
  userId: string,
  topic: string,
  difficulty: string,
  timeoutSeconds: number
): Promise<void> => {
  try {
    await addToQueue(userId, topic, difficulty, timeoutSeconds);
  } catch (error) {
    console.error("Error in enqueueUser:", error);
    throw error;
  }
};

const waitAndMatch = async (userId: string, timeoutSeconds: number) => {
  try {
    const timestamp = Date.now();
    while (Date.now() - timestamp < timeoutSeconds * 1000) {
      const match = await findMatchInQueue(userId, timeoutSeconds);
      if (match) {
        return match;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return null;
  } catch (error) {
    console.error("Error in waitAndMatch:", error);
    throw error;
  }
};

const createSession = async (
  userId1: string,
  userId2: string,
  topic: string,
  difficulty: string,
) => {
  try {
    const session: Session = {
      sessionId: `${userId1}-${userId2}-${Date.now()}`,
      userId1,
      userId2,
      topic,
      difficulty,
      timestamp: Date.now(),
    };
    await redis.saveSession(session);
  } catch (error) {
    console.error("Error in createSession:", error);
    throw error;
  }
};

// Check the status of a session
export const checkSessionStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.params;
    // Check if user is in queue
    const inQueue = await redis.checkIfUserInQueue(userId);
    if (inQueue) {
      res.status(200).json({ message: "User is in queue." });
      return;
    }

    // Check if user is in a session
    const session = await redis.findSessionByUser(userId);
    if (session) {
      res.status(200).json({ message: `User is in session ${session}` });
      return;
    }

    res.status(404).json({ message: "Session not found." });
    return;

  } catch (error) {
    console.error("Error in checkSessionStatus:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Cancel a session timeout and delete the session
export const cancelSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;

    // Cancel the timeout and remove session from Redis
    await redis.delSessionByUser(userId);

    res.status(200).json({ message: "Session timeout cancelled." });
  } catch (error) {
    console.error("Error in cancelSession:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
*/
