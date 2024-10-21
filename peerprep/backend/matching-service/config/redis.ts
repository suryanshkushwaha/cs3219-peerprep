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
const connectRedis = async (): Promise<Redis> => {
  try {
    const redisURI = process.env.REDIS_CLOUD_URI;

    // Throw an error if REDIS_CLOUD_URI is not defined
    if (!redisURI) {
      throw new Error("Missing REDIS_CLOUD_URI in environment variables");
    }

    // Establish Redis connection (Instantiate the Redis class directly)
    const redisClient = new Redis(redisURI);
    console.log(`Redis Connected: ${redisClient.options.host}`);

    return redisClient;
  } catch (error) {
    console.error(`Error connecting to Redis: ${(error as Error).message}`);
    process.exitCode = 1;
    throw error; // Optionally rethrow the error
  }
};

// Export the Redis connection function
export default connectRedis;

