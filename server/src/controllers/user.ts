/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import userModel from '../models/user';

export const getUserData = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }
    return res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error: any) {
    // TODO TYPE ERROR
    res.json({ success: false, message: error.message });
  }
};
