import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Function to connect to MongoDB using Mongoose
const connectDB = async (): Promise<void> => {
  try {
    const uri = process.env.ENV === 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

    if (!uri) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    const con = await mongoose.connect(uri);
    console.log(`MongoDB Connected!`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    process.exitCode = 1;
  }
};

// Export the connection function
export default connectDB;
