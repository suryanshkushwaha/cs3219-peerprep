import http from 'http';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import { startOTService } from './services/ot-service';
import { startSocketService } from './services/socket-service';
import collabRoutes from './routes/collab-routes';

const app = express();
const port = process.env.PORT || 3002;

// Middleware setup allowing all origins (development only)
app.use(cors({
  origin: '*', // Allow any origin
  optionsSuccessStatus: 200,
}));

// Middleware for parsing JSON
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ message: 'Collaboration service is up and running!' });
});

// Include routes
app.use('/api/collaboration', collabRoutes);

// Create an HTTP server with your Express app
const server = http.createServer(app);
startSocketService(server);

// MongoDB connection function
async function connectToDB() {
  try {
    // Connect to MongoDB Cloud using the URI from the environment variables
    await mongoose.connect(process.env.DB_CLOUD_URI as string, {
      dbName: 'Collab-Service'
    });
    
    console.log('MongoDB Connected!');

    // Start the OT service (WebSocket server)
    startOTService();

    // Start listening on the defined port
    server.listen(port, () => {
      console.log(`Collaboration service server listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to DB');
    console.error(err);
  }
}

// Initialize database connection
connectToDB();
