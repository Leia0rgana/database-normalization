import { Request, Response } from 'express';
import TableInfoModel from '../models/tableInfo';
import { FunctionalDependencyState } from '../utils/types';

//get table list
export const getTableList = async (req: Request, res: Response) => {
  try {
    const tables = await TableInfoModel.find().exec();
    res.status(200).json(tables);
  } catch (error) {
    console.error('Error getting tables:', error);
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
};

//add table
export const addTable = async (req: Request, res: Response) => {
  try {
    const { name, attributeList } = req.body;

    const newTableInfo = await TableInfoModel.create({
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
