import * as Y from 'yjs';
import { Server as SocketIOServer } from 'socket.io';

export const setupYjs = (io: SocketIOServer) => {
  io.on('connection', (socket) => {
    const ydoc = new Y.Doc();
    const yText = ydoc.getText('codemirror');
    socket.on('sync', (data) => {
      Y.applyUpdate(ydoc, data);
      socket.broadcast.emit('sync', Y.encodeStateAsUpdate(ydoc));
    });
  });
};

export const setupYjsDocument = () => {
  return new Y.Doc();
};
