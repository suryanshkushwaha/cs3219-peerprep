// import { redisLPop, redisRPush } from '../utils/redisUtils';

// // Push user
// export const addToQueue = async (userId: string, topic: string, difficulty: string) => {
//   const userData = { userId, topic, difficulty };
//   // store by topic
//   await redisRPush(`queue:${topic}`, JSON.stringify(userData));
// };

// // Pop user
// export const findMatchInQueue = async (topic: string) => {
//   // match by topic
//   const matchedUserData = await redisLPop(`queue:${topic}`);
//   return matchedUserData ? JSON.parse(matchedUserData) : null;
// };
