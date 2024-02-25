import { Schema, model, Document } from 'mongoose';
import { Role, TokenType } from '../utils/constants';

export interface IToken extends Document {
  _id: string;
  token: string;
  type: TokenType;
  expires: Date;
  isBlacklisted: boolean;
  userId: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

const TokenSchema: Schema = new Schema(
  {
    token: { type: String, required: true },
    type: { type: String, enum: Object.values(TokenType), required: true },
    expires: { type: Date, required: true },
    isBlacklisted: { type: Boolean, default: false },
    userId: {
      type: Schema.Types.ObjectId,
      required: true
    },
    role: { type: String, enum: Object.values(Role), default: 'user' }
  },
  { collection: 'tokens', timestamps: true }
);

export default model<IToken>('tokens', TokenSchema);
