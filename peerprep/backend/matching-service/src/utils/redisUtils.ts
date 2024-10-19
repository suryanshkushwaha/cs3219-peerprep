import connectRedis from '../../config/redis';

const redisUtils = {
    /**
     * Sets a key-value pair in Redis with an optional expiration time (in seconds).
     * @param key - The key to store the data.
     * @param value - The value to be stored.
     * @param expirationInSeconds - Optional expiration time for the key.
     */
    async set(key: string, value: string, expirationInSeconds?: number): Promise<void> {
        const redisClient = await connectRedis();

        if (expirationInSeconds) {
            await redisClient.setex(key, expirationInSeconds, value);
        } else {
            await redisClient.set(key, value);
        }
    }

    /**
     * Retrieves a value by key from Redis.
     * @param key - The key for the data to retrieve.
     * @returns - The stored value or null if the key does not exist.
     */
    async get(key: string): Promise<string | null> {
        const redisClient = await connectRedis();
        const value = await redisClient.get(key);
        return value;
    },

    /**
     * Deletes a key from Redis.
     * @param key - The key to delete.
     * @returns - The number of keys that were removed.
     */
    async del(key: string): Promise<number> {
        const redisClient = await connectRedis();
        const result = await redisClient.del(key);
        return result;
    },

    /**
     * Checks if a key exists in Redis.
     * @param key - The key to check.
     * @returns - 1 if the key exists, 0 if the key does not exist.
     */
    async exists(key: string): Promise<number> {
        const redisClient = await connectRedis();
        const exists = await redisClient.exists(key);
        return exists;
    },

    /**
     * Sets a key-value pair in Redis only if the key does not already exist.
     * @param key - The key to store the data.
     * @param value - The value to store.
     * @returns - True if the key was set, false if it already exists.
     */
    async setnx(key: string, value: string): Promise<boolean> {
        const redisClient = await connectRedis();
        const result = await redisClient.setnx(key, value);
        return result === 1; // Redis returns 1 if the key was set, 0 if it was not.
    },

    /**
     * Increments a value stored at a key.
     * @param key - The key whose value will be incremented.
     * @returns - The new value after incrementing.
     */
    async incr(key: string): Promise<number> {
        const redisClient = await connectRedis();
        const newValue = await redisClient.incr(key);
        return newValue;
    },

    /**
     * Decrements a value stored at a key.
     * @param key - The key whose value will be decremented.
     * @returns - The new value after decrementing.
     */
    async decr(key: string): Promise<number> {
        const redisClient = await connectRedis();
        const newValue = await redisClient.decr(key);
        return newValue;
    }
};

export default redisUtils;
