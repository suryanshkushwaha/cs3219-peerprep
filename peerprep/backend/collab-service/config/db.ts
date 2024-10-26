import mongoose from 'mongoose';

// Define the type for process.env, in case you're using a custom `.env` variable
declare global {
  namespace NodeJS {
    interface ProcessEnv {
        DB_CLOUD_URI: string;
    }
  }
}

// Function to start up and connect to MongoDB Cloud database
const connectDB = async (): Promise<void> => {
  try {
    // Explicitly assert that MONGODB_URI is a string
    const mongoURI = process.env.DB_CLOUD_URI as string;

    // Connect to MongoDB Cloud using the URI from the environment variables
    const con = await mongoose.connect(mongoURI, {
      dbName: 'Collab-Service' // Add any other valid options you might need
    });
    
    console.log(`MongoDB Connected: ${con.connection.host}`);
  } catch (error) {
    // Log error and exit process with non-zero code
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    process.exitCode = 1;
  }
};

// Export connection function to be used in other files
export default connectDB;

