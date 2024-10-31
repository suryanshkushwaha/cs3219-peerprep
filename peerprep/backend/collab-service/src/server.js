require('dotenv').config();
const http = require('http');
const { WebSocketServer } = require('ws');
const Y = require('yjs');
const { MongodbPersistence } = require('y-mongodb-provider');
const { setupWSConnection } = require('./websocket/utils.js');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server running');
});

// Set up WebSocket server
const wss = new WebSocketServer({ server });
wss.on('connection', setupWSConnection);

// Initialize MongoDB persistence
const mdb = new MongodbPersistence(process.env.DB_CLOUD_URI, {
  flushSize: 100,
  collectionName: 'collab-service',
  multipleCollections: true,
});

// Update persistence logic
require('./websocket/utils.js').setPersistence({
  bindState: async (docName, ydoc) => {
    const persistedDoc = await mdb.getYDoc(docName);
    const updates = Y.encodeStateAsUpdate(ydoc);
    Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedDoc));
    mdb.storeUpdate(docName, updates);
    ydoc.on('update', (update) => {
      mdb.storeUpdate(docName, update);
    });
  },
  writeState: () => Promise.resolve(true),
});

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
