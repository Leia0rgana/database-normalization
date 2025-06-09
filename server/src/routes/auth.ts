import express from 'express';
import { isAuthenticated, login, logout, signUp } from '../controllers/auth';
import { userAuth } from '../middleware/userAuth';

export const authRouter = express.Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/is-auth', userAuth, isAuthenticated);
