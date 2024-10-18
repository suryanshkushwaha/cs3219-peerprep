// // utils/redisUtils.ts

// import redisClient from '../../config/redis';

// // Push
// export const redisRPush = async (key: string, value: string) => {
//   await redisClient.rpush(key, value);  // Use rpush from the client
// };

// // Pop
// export const redisLPop = async (key: string): Promise<string | null> => {
//   return await redisClient.lpop(key);   // Use lpop from the client
// };

// // Get
// export const redisGet = async (key: string): Promise<string | null> => {
//   return await redisClient.get(key);    // Use get from the client
// };

// // Set
// export const redisSet = async (key: string, value: any): Promise<void> => {
//   await redisClient.set(key, JSON.stringify(value));  // Use set from the client
// };

// // Delete
// export const redisDelete = async (key: string): Promise<void> => {
//   await redisClient.del(key);   // Use del from the client
// };
