import express from 'express';
import cors from 'cors';
import collabRoutes from './routes/collab-routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/collab', collabRoutes);

// Basic route to check server status
app.get('/', (req, res) => {
  res.json({ message: 'Collaboration Service API is running' });
});

export default app;