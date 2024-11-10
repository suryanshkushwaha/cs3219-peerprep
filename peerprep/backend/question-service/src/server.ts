import express from 'express';
import cors from 'cors';
import { CorsOptions } from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../config/db';
import questionRoutes from './routes/questionRoutes';
import databaseRoutes from './routes/databaseRoutes';
import testcaseRoutes from './routes/testcaseRoutes';
import loadSampleData from './sampleData';
import { normalizeQuestionData } from './middleware/normalizationMiddleware';

connectDB() // Initialize MongoDB connection
  .then(() => {
    // Load sample data after DB connection is established
    loadSampleData(); 
  })
  .catch((error) => {
    console.error('Failed to connect to the database or load data', error);
  });

const PORT = process.env.PORT ?? 8080;

const app = express();

// Middleware for handling CORS and JSON parsing
/*
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
*/

// MODIFY TO ALLOW ALL ORIGINS
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
} as CorsOptions));
app.use(express.json());

// Apply normalization middleware to specific routes
// This middleware will normalize `categories` and `difficulty` fields to lowercase
app.use('/api/questions', normalizeQuestionData);


// API routes
app.use('/api', questionRoutes);

// Database routes
app.use('/api', databaseRoutes);

app.use('/api', testcaseRoutes);

// Health check route
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello World' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
