import * as dotenv from 'dotenv';
import Redis from 'ioredis';

// Load environment variables from .env
dotenv.config();

// Declare the type for process.env, including REDIS_CLOUD_URI
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REDIS_CLOUD_URI: string;
    }
  }
}

// Async function to connect to Redis
const connectRedis = () => {
  const redisURI = process.env.REDIS_CLOUD_URI;
  if (!redisURI) {
    throw new Error("Missing REDIS_CLOUD_URI in environment variables");
  }

  const redisClient = new Redis(redisURI, {
    // Automatically reconnect on connection loss
    retryStrategy: (times) => {
      const delay = Math.min(times * 100, 3000); // Exponential backoff with a cap of 3 seconds
      console.log(`Reconnecting to Redis in ${delay}ms...`);
      return delay;
    },
    reconnectOnError: (err) => {
      const targetErrors = ['READONLY', 'ECONNREFUSED'];
      if (targetErrors.some(target => err.message.includes(target))) {
        console.log('Reconnecting due to error:', err.message);
        return true; // Attempt reconnect if these errors are encountered
      }
      return false;
    }
  });

  // Handle successful connection
  redisClient.on('connect', () => {
    console.log('Connected to Redis successfully');
  });

  // Handle errors
  redisClient.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

  // Handle reconnection attempts
  redisClient.on('reconnecting', () => {
    console.log('Attempting to reconnect to Redis...');
  });

  // Handle when the connection is lost
  redisClient.on('end', () => {
    console.log('Redis connection closed.');
  });

  return redisClient;
};

export default connectRedis;

