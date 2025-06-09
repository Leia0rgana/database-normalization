import { InferSchemaType, Schema, model } from 'mongoose';

const user = new Schema({
  name: { type: String, require },
  email: { type: String, require, unique: true },
  password: { type: String, require },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

type User = InferSchemaType<typeof user>;

export default model<User>('User', user);
