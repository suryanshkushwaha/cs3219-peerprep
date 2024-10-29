import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './index';
import { setupWebSocket } from './utils/websocket';

dotenv.config();

const PORT = process.env.PORT || 3002;
const WS_PORT = process.env.WS_PORT || 3003;
const MONGO_URI = process.env.DB_CLOUD_URI;

// Connect to the appropriate MongoDB URI based on the environment
mongoose.connect(MONGO_URI as string)
  .then(() => {
    console.log(`Connected to MongoDB`);

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Initialize WebSocket on a separate WebSocket port
    setupWebSocket(WS_PORT);
    console.log(`WebSocket server running on port ${WS_PORT}`);
  })
  .catch(error => console.error('MongoDB connection error:', error));
