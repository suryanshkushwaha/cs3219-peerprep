import express from 'express';
import cors from 'cors';
import { CorsOptions } from 'cors';
import dotenv from 'dotenv';
import connectRedis from '../config/redis';
import apiRoutes from './routes/apiRoutes'; // Import your routes
//import { sseHandler, matchStatusStream } from './controllers/sseController'; // Import SSE controller

dotenv.config();

const PORT = process.env.PORT ?? 3333;

const app = express();

app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
} as CorsOptions));
app.use(express.json());

// Ensure we're using the cloud Redis URI
const REDIS_CLOUD_URI = process.env.REDIS_CLOUD_URI;
if (!REDIS_CLOUD_URI) {
  console.error('REDIS_CLOUD_URI is not defined in the environment variables');
  process.exit(1);
}

// Connect to Redis and handle reconnections
const redisClient = connectRedis();
app.locals.redisClient = redisClient;

// Define basic routes and SSE handlers
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

// Use routes from apiRoutes.ts
app.use('/', apiRoutes);

redisClient.on('connect', () => {
  console.log('Connected to Redis successfully');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redisClient.on('reconnecting', () => {
  console.log('Attempting to reconnect to Redis...');
});

redisClient.on('end', () => {
  console.log('Redis connection closed.');
});

// Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  redisClient.quit(() => {
    console.log('Closed Redis connection.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  redisClient.quit(() => {
    console.log('Closed Redis connection.');
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;