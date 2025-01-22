import 'dotenv/config';
import mongoose from 'mongoose';
import express, { Express, Request, Response } from 'express';
import TableInfoModel from './models/tableInfo';
import morgan from 'morgan';

const app: Express = express();
const port = process.env.PORT;

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

app.get('/', async (req: Request, res: Response) => {
  try {
    const tables = await TableInfoModel.find().exec();
    res.status(200).json(tables);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log('error getting data from server');
  }
});

app.get('/:tableId', async (req: Request, res: Response) => {
  try {
    const tableId = req.params.tableId;
    const table = await TableInfoModel.findById(tableId).exec();
    res.status(200).json(table);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error('error getting data from server');
  }
});

app.post('/', async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    const attributeList = req.body.attributeList;
    const functionalDependencies = req.body.functionalDependencies;

    const newTableInfo = await TableInfoModel.create({
      name: name,
      attributeList: attributeList,
      functionalDependencies: functionalDependencies,
    });

    res.status(201).json(newTableInfo);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error('error posting data to server');
  }
});
