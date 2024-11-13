import { findMatchInQueue } from './queueManager';
import * as redis from '../utils/redisUtils';


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
        // inject the question finder here, and return tgt with sessionID
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

// declare function to retrieve the user's match request status from the queue
export const updateStatus = async (userId: string) => {
    try {
        const status = await getStatus(userId);
        if (status.includes("request pending")) {
            try {
                // Find match
                await findMatchInQueue(userId);
            } catch (error) {
                console.error('Error in updateStatus:', error);
                //throw new Error("Failed to update the status of the user's match request");
            }
        }
        return status;
    } catch (error) {
        console.error('Error in updateStatus:', error);
        throw new Error("Failed to update the status of the user's match request");
    } /*finally {
        // Find match
        await findMatchInQueue(userId);
    }
    // Add session status check here
    */
};
