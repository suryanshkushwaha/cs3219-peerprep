// import dependencies required for mongoose
import mongoose from 'mongoose';

// Define the type for process.env, in case you're using a custom `.env` variable
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
    }
  }
}

// function to start up and connect to MongoDB database
const connectDB = async (): Promise<void> => {
  try {
    // Explicitly assert that MONGODB_URI is a string
    const con = await mongoose.connect("mongodb+srv://common:7hdyD9fClPPeZuNa@cs3219questionservice.qwfia.mongodb.net/?retryWrites=true&w=majority&appName=CS3219QuestionService" as string);
    console.log(`MongoDB Connected: ${con.connection.host}`);
  } catch (error) {
    // Log error and exit process with non-zero code
    console.error(`Error connecting to MongoDB: ${(error as Error).message}`);
    process.exitCode = 1;
  }
}

// export connection function to be used in index.js
//  module.exports = connectDB
export default connectDB;