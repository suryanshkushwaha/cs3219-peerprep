import http from 'http';
import express from 'express';
import 'dotenv/config';
import mongoose from 'mongoose';
import { startOTService } from './services/ot-service';

const app = express();

const port = process.env.PORT || 3002;

const server = http.createServer(app);

async function connectToDB() {
  try {
    await mongoose.connect(process.env.DB_CLOUD_URI as string, {
      dbName: 'peerprepCollabServiceDB'
    });
    console.log('MongoDB Connected!');

    startOTService();

    server.listen(port, () => {
      console.log(`Collaboration service server listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to DB');
    console.error(err);
  }
}

connectToDB();
