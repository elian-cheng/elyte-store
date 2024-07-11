import { Schema, model, Document } from 'mongoose';
import { Role } from '../utils/constants';

export interface IShippingInfo {
  address: string;
  city: string;
  country: string;
  state: string;
  zip: string;
}

export interface IUser extends Document {
  _id: string;
  email: string;
  name?: string;
  password: string;
  role: Role;
  phone?: string;
  shippingInfo?: IShippingInfo;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ShippingInfoSchema = new Schema<IShippingInfo>({
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String },
  zip: { type: String, required: true }
});

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
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
    shippingInfo: ShippingInfoSchema,
    isBanned: { type: Boolean, default: false }
  },
  { collection: 'users', timestamps: true }
);

export default model<IUser>('users', UserSchema);
