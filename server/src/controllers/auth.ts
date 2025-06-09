/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import userModel from '../models/user';
import { COOKIE_OPTIONS } from '../utils/constants';
import { transporter } from '../config/nodemailer';

// TODO TYPE ERROR

const JWT_SECRET: Secret | undefined = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not set');
  process.exit(1);
}
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export const signUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing details' });
  }

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let userRole: 'user' | 'admin' = 'user';
    if (ADMIN_EMAIL && email === ADMIN_EMAIL) {
      userRole = 'admin';
    }

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, COOKIE_OPTIONS);

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Добро пожаловать в DBNormalization',
      text: `Добро пожаловать в DBNormalization! Ваш аккаунт создан с использованием адреса электронной почты: ${email}`,
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({ success: true });
  } catch (error: any) {
    console.error('Error in signUp:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user || !user.password) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, COOKIE_OPTIONS);

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error in login:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({ success: true, message: 'Logged out' });
  } catch (error: any) {
    console.error('Error in logout:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const isAuthenticated = async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error in isAuthenticated:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
