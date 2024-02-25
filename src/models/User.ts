import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  name?: string;
  password: string;
  role: string;
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
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8
    },
    name: {
      type: String
    },
    role: { type: String, required: true, default: 'user' },
    address: { type: [Schema.Types.Mixed] },
    isBanned: { type: Boolean, default: false }
  },
  { collection: 'users', timestamps: true }
);

export default model<IUser>('users', UserSchema);
