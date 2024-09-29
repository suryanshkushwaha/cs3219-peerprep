import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../config/db';
import questionRoutes from './routes/questionRoutes';
import loadSampleData from './sampleData';

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

// API routes
app.use('/api', questionRoutes);

// Health check route
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello World' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
