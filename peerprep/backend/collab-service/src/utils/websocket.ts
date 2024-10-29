import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { setupYjs } from './yjs';

export const setupWebSocket = (port: number | string) => {
  const httpServer = createServer();
  const io = new SocketIOServer(httpServer, {
    cors: { origin: '*' },
    serveClient: false,
  });

  setupYjs(io);

  httpServer.listen(port, () => {
    console.log(`WebSocket server running on port ${port}`);
  });
};
