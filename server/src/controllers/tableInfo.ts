import { Request, Response } from 'express';
import TableInfoModel from '../models/tableInfo';
import { FunctionalDependencyState, TableInfo } from '../utils/types';
import { normalizeTo3NF } from '../algorithm/normalizeTable';

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
    const userId = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User must be authenticated',
      });
    }
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
        { new: true }
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
    const userId = req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User must be authenticated',
      });
    }

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

    const table = await TableInfoModel.findOne({
      name,
      user: userId,
    });

    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }

    const normalizedTables = await normalizeTo3NF(
      table as unknown as TableInfo
    );

    if (normalizedTables.length > 1) {
      const savedTables = await Promise.all(
        normalizedTables.map(async (newTable) => {
          return await TableInfoModel.create({
            ...newTable,
            user: userId,
            originalTableName: table.name,
          });
        })
      );
      res.status(200).json(savedTables);
    } else {
      await TableInfoModel.findOneAndUpdate(
        {
          name: normalizedTables[0].name,
        },
        {
          $set: {
            normalized: true,
          },
        }
      );

      res.status(200).json({ info: 'No normalization nedeed' });
    }
  } catch (error) {
    console.error('Error normalizing table:', error);
    res.status(500).json({ error: 'Failed to normalize table' });
  }
};

export const deleteTable = async (req: Request, res: Response) => {
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
      return res.status(400).json({ error: 'Table ID is required' });
    }

    const deleteResult = await TableInfoModel.deleteOne({
      _id: id,
      user: userId,
    });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        error: 'Table not found for this user or already deleted',
      });
    }

    res
      .status(200)
      .json({ success: true, message: 'Table deleted successfully' });
  } catch (error) {
    console.error('Error deleting table:', error);
    res.status(500).json({ error: 'Failed to delete table' });
  }
};

export const updateTable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { userId, name, attributeList } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: 'User must be authenticated to update',
      });
    }

    if (!id || !name || !attributeList) {
      return res.status(400).json({ error: 'Missing details' });
    }

    const updatedTable = await TableInfoModel.findOneAndUpdate(
      {
        _id: id,
        user: userId,
      },
      {
        $set: {
          name: name,
          attributeList: attributeList,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTable) {
      return res.status(404).json({
        error: 'Table to update not found for this user',
      });
    }

    res.status(200).json(updatedTable);
  } catch (error) {
    console.error('Error updating table:', error);
    res.status(500).json({ error: 'Failed to update table' });
  }
};

export const updateTableDependeciesList = async (
  req: Request,
  res: Response
) => {
  try {
    const { name } = req.params;
    const { userId, functionalDependencies } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: 'User must be authenticated to update',
      });
    }

    if (!name || !functionalDependencies) {
      return res.status(400).json({ error: 'Missing details' });
    }

    const updatedTable = await TableInfoModel.findOneAndUpdate(
      {
        name: name,
        user: userId,
      },
      {
        $set: {
          functionalDependencies: functionalDependencies,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTable) {
      return res.status(404).json({
        error: 'Table to update FDs not found for this user',
      });
    }

    res.status(200).json(updatedTable);
  } catch (error) {
    console.error('Error updating table FDs:', error);
    res.status(500).json({ error: 'Failed to update table FDs' });
  }
};
