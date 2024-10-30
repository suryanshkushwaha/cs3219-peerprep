import { Server } from '@hocuspocus/server'; // Imports the Hocuspocus server for real-time WebSocket communication.
import { Database } from '@hocuspocus/extension-database'; // Imports the Hocuspocus database extension to persist data.
import { getDocument, storeDocument } from './src/controller/collab-controller';

import connectDB from './config/db';                 
import dotenv from 'dotenv';

dotenv.config();                                     

const wsPort = parseInt(process.env.WS_PORT || '3003', 10);

// Defines an async function to start the Hocuspocus server with MongoDB and WebSocket configurations.
async function startServer() {  
  await connectDB();

  const server = Server.configure({
    port: wsPort,                                   
    timeout: 30000, // Sets a 30-second timeout for inactive connections.

    extensions: [
      new Database({
        fetch: async ({ documentName }) => getDocument(documentName), // Calls `getDocument` from `collab-controller` to retrieve document data when requested.
        store: async ({ documentName, state }) => storeDocument(documentName, state), // Calls `storeDocument` to store document data when a client updates it.
      }),
    ],
  });

  server.listen();                                  
  console.log(`Hocuspocus server is running on ws://localhost:${wsPort}`);
}

startServer();
