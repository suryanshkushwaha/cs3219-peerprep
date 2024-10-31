const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.ENV === 'PROD' ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

    if (!uri) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }

    await mongoose.connect(uri);
    console.log("MongoDB Connected!");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
