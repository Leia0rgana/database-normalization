import express from 'express';
import {
  addDependenciesToTables,
  addTable,
  getTableList,
} from '../controllers/tableInfo';

export const tableInfoRouter = express.Router();

tableInfoRouter.get('/tables', getTableList);
tableInfoRouter.post('/tables', addTable);
tableInfoRouter.patch('/tables/dependencies', addDependenciesToTables);
