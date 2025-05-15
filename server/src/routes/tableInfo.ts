import express from 'express';
import {
  addDependenciesToTables,
  addTable,
  getTableList,
} from '../controllers/tableInfo';

export const tableInfoRouter = express.Router();

tableInfoRouter.get('/', getTableList);
tableInfoRouter.post('/', addTable);
tableInfoRouter.patch('/dependencies', addDependenciesToTables);
