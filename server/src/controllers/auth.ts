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
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
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

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
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

export const sendVerifyOtp = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, message: 'Account already verified' });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email!,
      subject: 'Подтверждение аккаунта | DBNormalization',
      text: `Ваш код для подтверждения аккаунта: ${otp}. Код действителен 24 часа.`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Otp sent' });
  } catch (error: any) {
    console.error('Error in sendVerifyOtp:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ success: false, message: 'Missing details' });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    if (user.verifyOtp === '' || user.verifyOtp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid verification code' });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: 'Verification code expired' });
    }

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: 'Successful email verification' });
  } catch (error: any) {
    console.error('Error in verifyEmail:', error);
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
