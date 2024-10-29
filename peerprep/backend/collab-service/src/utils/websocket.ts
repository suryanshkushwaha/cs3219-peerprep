import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { setupYjs } from './yjs'; // Import the Yjs setup

export const setupWebSocket = (wsPort: number | string) => {
  // Create an HTTP server to handle WebSocket connections on the given port
  const httpServer = createServer();

  const io = new SocketIOServer(httpServer, {
    cors: { origin: '*' },
    serveClient: false,
  });

  // Setup Yjs synchronization on this Socket.IO server
  setupYjs(io);

  // Start the HTTP server on the specified WebSocket port
  httpServer.listen(wsPort, () => {
    console.log(`WebSocket server running on port ${wsPort}`);
  });

  io.on('connection', (socket) => {
    console.log('New WebSocket client connected');

    socket.on('disconnect', () => {
      console.log('WebSocket client disconnected');
    });
  });
};


