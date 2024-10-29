import express, { Request, Response } from 'express';
import cors from 'cors';
import collabRoutes from './routes/collab-routes';

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/collab', collabRoutes);

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Collaboration Service API' });
});

// Export the app (not default)
export { app };

