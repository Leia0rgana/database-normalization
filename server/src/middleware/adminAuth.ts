import { NextFunction, Request, Response } from 'express';
import userModel from '../models/user';

export const adminAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.body.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Cannot check admin role',
    });
  }

  try {
    const user = await userModel.findById(userId).select('-password');

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Admin access required' });
    }

    next();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
