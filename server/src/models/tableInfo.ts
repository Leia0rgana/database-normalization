import mongoose from 'mongoose';
import { TableInfo } from '../utils/types';

const AttributeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isPrimaryKey: { type: Boolean, default: false },
    foreignKeyReference: {
      tableName: String,
      attributeName: String,
    },
  },
  { _id: false }
);

const TableInfoSchema = new mongoose.Schema<TableInfo>({
  user: { type: String, required: true },
  name: { type: String, required: true },
  attributeList: [AttributeSchema],
  functionalDependencies: [
    {
      determinant: [String],
      dependent: [String],
    },
  ],
  normalized: { type: Boolean, default: false },
});

export default mongoose.model<TableInfo>('TableInfo', TableInfoSchema);
