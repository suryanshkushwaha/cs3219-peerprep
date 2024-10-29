import { MongoClient, Db } from 'mongodb';

const uri = process.env.DB_CLOUD_URI || 'mongodb://localhost:27017';
let db: Db;

export const connectDB = async () => {
  if (!db) {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(process.env.DB_NAME || 'collaborationDB');
    console.log(`Connected to MongoDB: ${uri}`);
  }
  return db;
};

export const getDocumentCollection = async (collectionName: string) => {
  const database = await connectDB();
  return database.collection(collectionName);
};
