import express from 'express';
import { adminAuth } from '../middleware/adminAuth';
import { getUsers, deleteUser, updateUser } from '../controllers/admin';
import { userAuth } from '../middleware/userAuth';

export const adminRouter = express.Router();

adminRouter.get('/users', userAuth, adminAuth, getUsers);
adminRouter.delete('/users/:id', userAuth, adminAuth, deleteUser);
adminRouter.patch('/users/:id', userAuth, adminAuth, updateUser);
