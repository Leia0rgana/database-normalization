import express from 'express';
import { userAuth } from '../middleware/userAuth';
import { getUserData } from '../controllers/user';

export const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserData);
