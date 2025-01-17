import 'dotenv/config';
import mongoose from 'mongoose';
import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = process.env.PORT;

if (!port) {
  console.error('Error: PORT is missing');
  process.exit(1);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

mongoose
  .connect(process.env.CONNECTION_STRING || '')
  .then(() => console.log('Connected to database'))
  .catch(console.error);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world');
});
