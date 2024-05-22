import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  level: number;
  score: number;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  level: { type: Number, required: true },
  score: { type: Number, required: true }
});

export const User = mongoose.model<IUser>('User', UserSchema);
