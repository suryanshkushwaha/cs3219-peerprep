import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

export const setupWebSocket = (wsPort: number | string) => {
  const httpServer = createServer();

  const io = new SocketIOServer(httpServer, {
    cors: { origin: '*' },
    serveClient: false,
  });

  io.on('connection', (socket) => {
    console.log(`New WebSocket client connected: ${socket.id}`);
    socket.on('disconnect', () => {
      console.log(`Client ${socket.id} disconnected`);
    });
  });

  httpServer.listen(wsPort, () => {
    console.log(`WebSocket server running on port ${wsPort}`);
  });
};
