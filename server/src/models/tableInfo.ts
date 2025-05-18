import { InferSchemaType, Schema, model } from 'mongoose';
import { Attribute, FunctionalDependency } from '../utils/types';

const tableInfo = new Schema({
  user: { type: String },
  name: { type: String, require },
  attributeList: { type: Array<Attribute>, require },
  functionalDependencies: { type: Array<FunctionalDependency> },
});

type TableInfo = InferSchemaType<typeof tableInfo>;

export default model<TableInfo>('TableInfo', tableInfo);
