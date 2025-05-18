/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import userModel from '../models/user';

export const getUserData = async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error: any) {
    console.error('Error in getUserData:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
