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
  phone: string;
  role: Role;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMutation {
  name: string;
  email: string;
  password?: string;
  role?: Role;
  phone: string;
}
