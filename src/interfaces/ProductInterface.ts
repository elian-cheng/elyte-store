export interface IProduct {
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

export interface IProductShort {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  images: string[];
  colors: string[];
  discountPrice: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProductImage {
  id: number;
  url: string;
  productId: number;
  product: IProduct;
}

export interface IProductImageShort {
  url: string;
}

export interface IProductImagesUpdate {
  images: string[];
}

export interface IProductCreate {
  title: string;
  description: string;
  category: string;
  brand: string;
  images: string[];
  colors: string[];
  price: number | string;
  discountPercentage: number | string;
  rating: number | string;
  stock: number | string;
}

export interface IProductUpdate extends IProductCreate {
  isActive: boolean;
}
