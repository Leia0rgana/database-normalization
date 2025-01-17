import { Schema } from 'mongoose';

type Field = {
  name: string;
  dataType: string;
};

const tableSchema = new Schema({
  name: { type: String, require },
  fields: { type: Array<Field>, require },
});
