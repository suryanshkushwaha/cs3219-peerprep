import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../config/db';

// initialize connection to MongoDB database
connectDB()

const PORT = process.env.PORT ?? 8080;

const app = express();
app.options(
  '*',
  cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
  }), 
)

app.use(cors());

app.listen(PORT, () => {
    console.log('Server is running on localhost:' + PORT);
})

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello World' })
});

module.exports = app