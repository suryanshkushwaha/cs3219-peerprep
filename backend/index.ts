import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT ?? 8080;

const app = express();
app.use(cors());

app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log('Server is running on localhost:' + PORT);
})
