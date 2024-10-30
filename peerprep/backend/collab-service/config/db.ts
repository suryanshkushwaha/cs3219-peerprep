import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.ENV === 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;
const client = new MongoClient(uri || 'mongodb://127.0.0.1:27017');

async function connectDB() {
  await client.connect();
  console.log(`Connected to MongoDB at ${uri}`);
  return client.db().collection('documents');  // MongoDB collection for documents
}

export const db = await connectDB();
