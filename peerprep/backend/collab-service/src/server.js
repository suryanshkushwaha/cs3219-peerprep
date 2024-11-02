const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const StaticServer = require('node-static').Server;
const ywsUtils = require('y-websocket/bin/utils');
const setupWSConnection = ywsUtils.setupWSConnection;
const docs = ywsUtils.docs;
const connectDB = require('../config/db');
const { storeDocument, getDocument } = require('./controller/collab-controller');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

// Connect to MongoDB
connectDB();

// Endpoint to save a document to MongoDB
app.post('/api/saveDocument', async (req, res) => {
  try {
    const { name, data } = req.body;
    await storeDocument(name, Buffer.from(data));
    res.status(200).json({ message: 'Document saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to retrieve a document from MongoDB
app.get('/api/getDocument/:name', async (req, res) => {
  try {
    const name = req.params.name;
    const documentData = await getDocument(name);
    res.status(200).json({ data: Array.from(documentData) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve static files and set up WebSocket connections for y-websocket
const staticServer = new StaticServer('../', { cache: false, gzip: true });
app.get('*', (req, res) => {
  staticServer.serve(req, res);
});

wss.on('connection', (conn, req) => {
  setupWSConnection(conn, req, { gc: req.url.slice(1) !== 'ws/prosemirror-versions' });
});

const PORT = process.env.PORT || 1234;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:1234`);
});
