import express from 'express';
import {
  addDependenciesToTables,
  addTable,
  getTableList,
  getTableDependeciesList,
  normalizeTable,
} from '../controllers/tableInfo';
import { userAuth } from '../middleware/userAuth';

export const tableInfoRouter = express.Router();

tableInfoRouter.get('/', userAuth, getTableList);
tableInfoRouter.post('/', userAuth, addTable);
tableInfoRouter.patch('/dependencies', addDependenciesToTables);
tableInfoRouter.get('/dependencies/:name', getTableDependeciesList);
tableInfoRouter.post('/normalize/:name', userAuth, normalizeTable);
