import express from 'express';
import {
  addDependenciesToTables,
  addTable,
  getTableList,
  getTableDependeciesList,
  normalizeTable,
  deleteTable,
  updateTable,
} from '../controllers/tableInfo';
import { userAuth } from '../middleware/userAuth';

export const tableInfoRouter = express.Router();

tableInfoRouter.get('/', userAuth, getTableList);
tableInfoRouter.post('/', userAuth, addTable);
tableInfoRouter.patch('/dependencies', addDependenciesToTables);
tableInfoRouter.get('/dependencies/:name', getTableDependeciesList);
tableInfoRouter.post('/normalize/:name', userAuth, normalizeTable);
tableInfoRouter.delete('/:id', userAuth, deleteTable);
tableInfoRouter.patch('/:id', userAuth, updateTable);
