import express from 'express';
import cors from 'cors';
import collabRoutes from './routes/collab-routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', collabRoutes);

export default app;
