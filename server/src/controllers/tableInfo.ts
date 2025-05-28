import { Request, Response } from 'express';
import TableInfoModel from '../models/tableInfo';
import { FunctionalDependencyState, TableInfo } from '../utils/types';
import { normalizeTo2NF } from '../algorithm/normalizeTableToSecondForm';

//get table list
export const getTableList = async (req: Request, res: Response) => {
  try {
    const tables = await TableInfoModel.find({ user: req.body.userId });
    res.status(200).json(tables);
  } catch (error) {
    console.error('Error getting tables:', error);
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
};

//add table
export const addTable = async (req: Request, res: Response) => {
  try {
    const { name, attributeList, userId } = req.body;

    const newTableInfo = await TableInfoModel.create({
      user: userId,
      name,
      attributeList,
    });

    res.status(201).json(newTableInfo);
  } catch (error) {
    console.error('Error creating table:', error);
    res.status(500).json({ error: 'Failed to create table' });
  }
};

// add FDs to existing tables
export const addDependenciesToTables = async (req: Request, res: Response) => {
  try {
    const dependencies: FunctionalDependencyState[] = req.body;

    const updatePromises = dependencies.map((dependency) =>
      TableInfoModel.findOneAndUpdate(
        { name: dependency.tableName },
        {
          $push: {
            functionalDependencies: {
              determinant: dependency.determinant,
              dependent: dependency.dependent,
            },
          },
        },
        { new: true } // возврат обновленного документа
      )
    );

    const results = await Promise.all(updatePromises);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error adding FDs:', error);
    res.status(500).json({ error: 'Failed to add FDs' });
  }
};

export const getTableDependeciesList = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ error: 'Table name is required' });
    }

    const table = await TableInfoModel.findOne({
      name,
    });

    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }

    res.status(200).json(table.functionalDependencies || []);
  } catch (error) {
    console.error('Error getting table dependencies:', error);
    res.status(500).json({ error: 'Failed to fetch table dependencies' });
  }
};

export const normalizeTable = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const userId = req.body.userId;

    if (!name) {
      return res.status(400).json({ error: 'Table name is required' });
    }

    // Находим таблицу
    const table = await TableInfoModel.findOne({
      name,
      user: userId,
    });

    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }

    // Нормализуем таблицу
    const normalizedTables = await normalizeTo2NF(
      table as unknown as TableInfo
    );

    // Сохраняем новые таблицы в базу данных
    const savedTables = await Promise.all(
      normalizedTables.map(async (newTable) => {
        // Создаем новую таблицу с флагом normalized
        return await TableInfoModel.create({
          ...newTable,
          user: userId,
          normalized: true,
          originalTableName: table.name, // Добавляем ссылку на исходную таблицу
        });
      })
    );

    res.status(200).json(savedTables);
  } catch (error) {
    console.error('Error normalizing table:', error);
    res.status(500).json({ error: 'Failed to normalize table' });
  }
};
