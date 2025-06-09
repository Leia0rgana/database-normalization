import { Request, Response } from 'express';
import userModel from '../models/user';
import bcrypt from 'bcryptjs';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User must be authenticated',
      });
    }

    const users = await userModel.find();

    if (users.length !== 0) res.status(200).json(users);
    else
      return res
        .status(404)
        .json({ success: false, message: 'Users not found' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error getting users:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User must be authenticated to delete',
      });
    }

    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const deleteResult = await userModel.deleteOne({
      _id: id,
    });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found or already deleted',
      });
    }

    res
      .status(200)
      .json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, name, email, password } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: 'User must be authenticated to update',
      });
    }

    if (!id || !name || !email || !password) {
      return res.status(400).json({ error: 'Missing details' });
    }

    const updateData: { name: string; email: string; password?: string } = {
      name: name,
      email: email,
    };

    if (password !== '********') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await userModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        error: 'User to update not found',
      });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};
