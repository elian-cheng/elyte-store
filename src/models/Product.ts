import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  images: string[];
  colors?: string[];
  discountPrice?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, min: [1, 'wrong min price'], max: [10000, 'wrong max price'] },
    discountPercentage: {
      type: Number,
      min: [0, 'wrong min discount'],
      max: [99, 'wrong max discount']
    },
    rating: {
      type: Number,
      min: [0, 'wrong min rating'],
      max: [5, 'wrong max rating'],
      default: 0
    },
    stock: { type: Number, min: [0, 'wrong min stock'], default: 0 },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    images: { type: [String], required: true },
    colors: { type: [String] },
    discountPrice: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { collection: 'products', timestamps: true }
);

export default model<IProduct>('products', productSchema);
