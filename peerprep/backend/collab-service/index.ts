import { Server } from '@hocuspocus/server';
import { Database } from '@hocuspocus/extension-database';
import { getDocument, storeDocument } from './src/controller/collab-controller';
import dotenv from 'dotenv';

dotenv.config();

const port = parseInt(process.env.WS_PORT || '3003');

async function startServer() {
  const server = Server.configure({
    port,
    extensions: [
      new Database({
        // Retrieve the document in MongoDB
        fetch: async ({ documentName }) => {
          return getDocument(documentName);
        },
        // Store the document in MongoDB
        store: async ({ documentName, state }) => {
          storeDocument(documentName, state);
        },
      }),
    ],
  });

  server.listen();
  console.log(`Hocuspocus server is running on ws://localhost:${port}`);
}

startServer();
