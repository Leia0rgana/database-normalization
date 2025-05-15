import express, { Express } from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { authRouter } from './routes/auth';
import { tableInfoRouter } from './routes/tableInfo';

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));
app.use(morgan('dev'));

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

app.use('/auth', authRouter);
app.use('/', tableInfoRouter);
