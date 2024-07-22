import { Role } from 'utils/constants';
import { ITokens } from './TokensInterface';

export interface IUserLogin {
  _id: string;
  email: string;
  name: string;
  phone: string;
  role: Role;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
  tokens: ITokens;
}
export interface IUser {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  role: Role;
  shippingInfo?: IUserShippingInfo;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserShippingInfo {
  address: string;
  city: string;
  country: string;
  state: string;
  zip: string;
}

export interface IUserMutation {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  phone?: string;
  shippingInfo?: IUserShippingInfo;
}

export interface IUserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  shippingInfo: IUserShippingInfo;
}
