import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import TableInfoModel from './models/tableInfo';
import morgan from 'morgan';
import { FunctionalDependencyState } from './types';

const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

if (!port) {
  console.error('Error: PORT is missing');
  process.exit(1);
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

mongoose
  .connect(process.env.CONNECTION_STRING || '')
  .then(() => console.log('Connected to database'))
  .catch(console.error);

//get table list
app.get('/tables', async (req: Request, res: Response) => {
  try {
    const tables = await TableInfoModel.find().exec();
    res.status(200).json(tables);
  } catch (error) {
    console.error('Error getting tables:', error);
    res.status(500).json({ error: 'Failed to fetch tables' });
  }
});

//add table
app.post('/tables', async (req: Request, res: Response) => {
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
});

// add FDs to existing tables
app.patch('/tables/dependencies', async (req: Request, res: Response) => {
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
});
