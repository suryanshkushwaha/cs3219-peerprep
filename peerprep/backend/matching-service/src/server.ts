import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectRedis from '../config/redis';

dotenv.config();

const PORT = process.env.PORT ?? 3000;

const app = express();

// Middleware for handling CORS and JSON parsing
app.use(cors({
  origin: (origin, callback) => {
    if (origin?.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
}));
app.use(express.json());

// Initialize Redis connection
connectRedis()
  .then((redisClient) => {
    // Health check route
    app.get('/hello', (req, res) => {
      res.json({ message: 'Hello World' });
    });

    // Example Redis route
    app.get('/redis-test', async (req, res) => {
      try {
        await redisClient.set('test-key', 'Hello from Redis!');
        const value = await redisClient.get('test-key');
        res.json({ value });
      } catch (error) {
        res.status(500).json({ error: 'Redis operation failed' });
      }
    });

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to Redis:', error);
    process.exit(1);
  });

export default app;