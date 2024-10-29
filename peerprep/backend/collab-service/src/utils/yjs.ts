import * as Y from 'yjs';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { getDocumentCollection } from '../db/client';

const COLLECTION_NAME = process.env.COLLECTION_NAME || 'collaboration_sessions';

export const setupYjs = (io: SocketIOServer) => {
  io.on('connection', async (socket: Socket) => {
    console.log(`Yjs client connected: ${socket.id}`);

    // Join room for session management
    const sessionId = socket.handshake.query.sessionId as string;
    socket.join(sessionId);

    // Load document from MongoDB or create a new one
    const collection = await getDocumentCollection(COLLECTION_NAME);
    let session = await collection.findOne({ sessionId });
    const ydoc = new Y.Doc();

    if (session) {
      Y.applyUpdate(ydoc, session.data);
    }

    // Broadcast updates to clients
    const broadcastUpdate = (update: Uint8Array) => {
      socket.to(sessionId).emit('y-update', Array.from(update));
    };

    ydoc.on('update', async (update) => {
      broadcastUpdate(update);

      // Save document state in MongoDB
      const encodedState = Y.encodeStateAsUpdate(ydoc);
      await collection.updateOne(
        { sessionId },
        { $set: { data: encodedState } },
        { upsert: true }
      );
    });

    socket.on('y-update', (update: number[]) => {
      Y.applyUpdate(ydoc, new Uint8Array(update));
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};
