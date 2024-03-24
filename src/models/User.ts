import { Schema, model, Document } from 'mongoose';
import { Role } from '../utils/constants';

export interface IUser extends Document {
  _id: string;
  email: string;
  name?: string;
  password: string;
  role: Role;
  phone?: number;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: number;
  };
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: Number,
      unique: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8
    },
    name: {
      type: String
    },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    address: { type: [Schema.Types.Mixed] },
    isBanned: { type: Boolean, default: false }
  },
  { collection: 'users', timestamps: true }
);

export default model<IUser>('users', UserSchema);
