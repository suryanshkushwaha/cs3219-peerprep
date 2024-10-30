import { Server } from '@hocuspocus/server';
import { Database } from '@hocuspocus/extension-database';
import { getDocument, storeDocument } from './src/controller/collab-controller';
import connectDB from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const wsPort = parseInt(process.env.WS_PORT || '3003');

async function startServer() {
  await connectDB();
  const server = Server.configure({
    port: wsPort,
    timeout: 30000,
    extensions: [
      new Database({
        fetch: async ({ documentName }) => getDocument(documentName),
        store: async ({ documentName, state }) => storeDocument(documentName, state),
      }),
    ],
  });

  server.listen();
  console.log(`Hocuspocus server is running on ws://localhost:${wsPort}`);
}

startServer();

