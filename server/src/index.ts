import express, { Express } from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { authRouter } from './routes/auth';
import { tableInfoRouter } from './routes/tableInfo';
import { connectToDB } from './config/mongodb';
import { userRouter } from './routes/user';

const app: Express = express();
const port = process.env.PORT;

const allowedOrigins = ['http://localhost:5173', 'http://185.221.155.203:5173'];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(morgan('dev'));

if (!port) {
  console.error('Error: PORT is missing');
  process.exit(1);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

connectToDB();

app.use('/auth', authRouter);
app.use('/tables', tableInfoRouter);
app.use('/user', userRouter);
