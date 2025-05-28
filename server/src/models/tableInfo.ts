import mongoose from 'mongoose';
import { TableInfo } from '../utils/types';

const TableInfoSchema = new mongoose.Schema<TableInfo>({
  user: { type: String, required: true },
  name: { type: String, required: true },
  attributeList: [
    {
      name: { type: String, required: true },
      isPrimaryKey: { type: Boolean, default: false },
      foreignKeyReference: {
        tableName: String,
        attributeName: String,
      },
    },
  ],
  functionalDependencies: [
    {
      determinant: [String],
      dependent: [String],
    },
  ],
  normalized: { type: Boolean, default: false },
  originalTableName: { type: String },
});

export default mongoose.model<TableInfo>('TableInfo', TableInfoSchema);
