import { Server as SocketIOServer, Socket } from 'socket.io';

export class SocketService {
  private io: SocketIOServer;

  constructor(server: any) {
    this.io = new SocketIOServer(server, {
      cors: { origin: 'http://localhost:3000' }
    });
    this.initialize();
  }

  private initialize() {
    // Handle client connections
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);
      
      // Event listeners for collaboration actions
      socket.on('join-session', (sessionId) => this.handleJoinSession(socket, sessionId));
      socket.on('leave-session', (sessionId) => this.handleLeaveSession(socket, sessionId));
      socket.on('edit', (data) => this.handleEdit(socket, data));
      socket.on('cursor-move', (data) => this.handleCursorMove(socket, data));

      // Handle disconnection
      socket.on('disconnect', () => this.handleDisconnect(socket));
    });
  }

  private handleJoinSession(socket: Socket, sessionId: string) {
    socket.join(sessionId);
    socket.to(sessionId).emit('user-joined', { userId: socket.id });
    console.log(`User ${socket.id} joined session ${sessionId}`);
  }

  private handleLeaveSession(socket: Socket, sessionId: string) {
    socket.leave(sessionId);
    socket.to(sessionId).emit('user-left', { userId: socket.id });
    console.log(`User ${socket.id} left session ${sessionId}`);
  }

  private handleEdit(socket: Socket, data: any) {
    const { sessionId, operations } = data;
    socket.to(sessionId).emit('edit', operations);
    console.log(`Edit operation from ${socket.id} in session ${sessionId}`);
  }

  private handleCursorMove(socket: Socket, data: any) {
    const { sessionId, cursor } = data;
    socket.to(sessionId).emit('cursor-move', { userId: socket.id, cursor });
    console.log(`Cursor move from ${socket.id} in session ${sessionId}`);
  }

  private handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
  }
}

export const startSocketService = (server: any) => new SocketService(server);
