const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const StaticServer = require('node-static').Server;
const ywsUtils = require('y-websocket/bin/utils');
const setupWSConnection = ywsUtils.setupWSConnection;
const docs = ywsUtils.docs;
const connectDB = require('../config/db');
const { storeDocument, getDocument } = require('./controller/collab-controller');
const { Server } = require("socket.io");
const cors = require("cors");
const gptRoutes = require('./routes/gptRoutes');
const dotenv = require('dotenv');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

app.use('/api', gptRoutes);

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

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    try {
      socket.join(room);
      console.log(`User ${socket.id} joined room ${room}`);
    } catch (error) {
      console.error(`Error joining room: ${error.message}`);
      socket.emit("error_message", { message: "Failed to join room. Try again later." });
    }
  });

  socket.on("send_message", (data) => {
    try {
      socket.in(data.room).emit("receive_message", data);
    } catch (error) {
      console.error(`Error sending message: ${error.message}`);
      socket.emit("error_message", { message: "Failed to send message. Try again later." });
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`User Disconnected: ${socket.id} - Reason: ${reason}`);
    if (reason === "io server disconnect") {
      socket.connect(); // Reconnect on server-side disconnect
    }
  });

  socket.on("error", (error) => {
    console.error(`Socket error: ${error.message}`);
  });
});


const PORT = process.env.PORT || 1234;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});