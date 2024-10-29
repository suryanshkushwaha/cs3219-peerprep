import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { app } from './index';  // Import with named import
import { setupWebSocket } from './utils/websocket';

dotenv.config();

const PORT = process.env.PORT || 3004;
const WS_PORT = process.env.WS_PORT || 3005;
const MONGO_URI = process.env.DB_CLOUD_URI || 'mongodb://localhost:27017/collaborationDB';

async function startServer() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB at ${MONGO_URI}`);

    // Start the HTTP server
    const server = app.listen(PORT, () => {
      console.log(`Collaboration service API running on port ${PORT}`);
    });

    // Set up the WebSocket server on a different port
    setupWebSocket(WS_PORT);
    console.log(`WebSocket server running on port ${WS_PORT}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
