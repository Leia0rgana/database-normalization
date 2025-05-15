/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import userModel from '../models/user';
import { COOKIE_OPTIONS } from '../utils/constants';

// TODO TYPE ERROR

const JWT_SECRET: Secret | undefined = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not set');
  process.exit(1);
}

export const signUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ success: false, message: 'Missing details' });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); //TODO read about 10
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, COOKIE_OPTIONS);

    return res.json({ success: true });
  } catch (error: any) {
    // TODO TYPE ERROR
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: 'Email and password are required',
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user || !user.password) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, COOKIE_OPTIONS);

    return res.json({ success: true });
  } catch (error: any) {
    res.json({ success: false, message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('token');
    return res.json({ success: true, message: 'Logged out' });
  } catch (error: any) {
    res.json({ success: false, message: error.message });
  }
};
