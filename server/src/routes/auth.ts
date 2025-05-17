import express from 'express';
import {
  isAuthenticated,
  login,
  logout,
  sendVerifyOtp,
  signUp,
  verifyEmail,
} from '../controllers/auth';
import { userAuth } from '../middleware/userAuth';

export const authRouter = express.Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);
authRouter.get('/is-auth', userAuth, isAuthenticated);
