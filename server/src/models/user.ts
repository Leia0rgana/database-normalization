import { InferSchemaType, Schema, model } from 'mongoose';

const user = new Schema({
  name: { type: String, require },
  email: { type: String, require, unique: true },
  password: { type: String, require },
  verifyOtp: { type: String, default: '' },
  verifyOtpExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: '' },
  resetOtpExpireAT: { type: Number, default: 0 },
});

type User = InferSchemaType<typeof user>;

export default model<User>('User', user);
