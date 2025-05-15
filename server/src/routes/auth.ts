import express from 'express';
import { login, logout, signUp } from '../controllers/auth';

export const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
