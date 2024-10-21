import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectRedis from '../config/redis';

dotenv.config();

const PORT = process.env.PORT ?? 3000;

const app = express();

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

// Ensure we're using the cloud Redis URI
const REDIS_CLOUD_URI = process.env.REDIS_CLOUD_URI;
if (!REDIS_CLOUD_URI) {
  console.error('REDIS_CLOUD_URI is not defined in the environment variables');
  process.exit(1);
}

connectRedis()
  .then((redisClient) => {
    app.get('/hello', (req, res) => {
      res.json({ message: 'Hello World' });
    });

    app.get('/redis-test', async (req, res) => {
      try {
        await redisClient.set('test-key', 'Hello from Cloud Redis!');
        const value = await redisClient.get('test-key');
        res.json({ value });
      } catch (error) {
        res.status(500).json({ error: 'Redis operation failed' });
      }
    });

    // Additional endpoints (set, get, delete) can be added here as in the previous example

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Connected to Redis at ${redisClient.options.host}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to Redis:', error);
    process.exit(1);
  });

export default app;