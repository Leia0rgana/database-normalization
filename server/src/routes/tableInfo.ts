import express from 'express';
import {
  addDependenciesToTables,
  addTable,
  getTableList,
} from '../controllers/tableInfo';
import { userAuth } from '../middleware/userAuth';

export const tableInfoRouter = express.Router();

tableInfoRouter.get('/', userAuth, getTableList);
tableInfoRouter.post('/', userAuth, addTable);
tableInfoRouter.patch('/dependencies', userAuth, addDependenciesToTables);
