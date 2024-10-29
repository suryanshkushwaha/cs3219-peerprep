import * as Y from 'yjs';
import { Server as SocketIOServer } from 'socket.io';
import { WebsocketProvider } from 'y-websocket';
import { Session } from '../model/Session';

const yDocs: Map<string, Y.Doc> = new Map();

export const setupYjs = (io: SocketIOServer) => {
  io.on('connection', (socket) => {
    console.log('Yjs client connected');

    socket.on('join', async ({ collabId }) => {
      let ydoc = yDocs.get(collabId);

      // Initialize or retrieve the Yjs document
      if (!ydoc) {
        ydoc = new Y.Doc();
        yDocs.set(collabId, ydoc);

        // Load initial content from MongoDB if it exists
        const session = await Session.findOne({ collabId });
        if (session) {
          Y.applyUpdate(ydoc, Buffer.from(session.code, 'base64'));
        }
      }

      const provider = new WebsocketProvider('ws://localhost:' + process.env.WS_PORT, collabId, ydoc);

      socket.join(collabId);
      socket.emit('yjs-initial', Y.encodeStateAsUpdate(ydoc));

      ydoc.on('update', (update: Uint8Array) => {
        io.to(collabId).emit('yjs-update', update);
      });

      socket.on('yjs-update', (update: Uint8Array) => {
        Y.applyUpdate(ydoc, update);
      });

      socket.on('disconnect', () => {
        console.log(`Yjs client disconnected from room ${collabId}`);
      });
    });
  });
};
