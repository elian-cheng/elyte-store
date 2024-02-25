import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import Product, { IProduct } from '../models/Product';
import { SortOrder } from 'mongoose';

/**
 * Create a product
 * @param {string} title
 * @param {string} description
 * @param {string} category
 * @param {string} brand
 * @param {number} price
 * @param {number} discountPercentage
 * @param {number} rating
 * @param {number} stock
 * @param {string[]} images
 * @param {string[]} colors
 * @returns {Promise<Product>}
 */
const createProduct = async (
  title: string,
  description: string,
  category: string,
  brand: string,
  stock: number,
  price: number,
  discountPercentage: number,
  images: string,
  rating: number,
  colors: string[] = []
): Promise<IProduct> => {
  const product = new Product({
    title,
    description,
    category,
    brand,
    stock,
    price,
    discountPercentage,
    images,
    rating,
    colors
  });
  product.discountPrice = +(product.price * (1 - product.discountPercentage / 100)).toFixed(2);
  return await product.save();
};

/**
 * Get products
 * @returns {Promise<IProduct[]>}
 */
const getProducts = async (
  _page: number = 1,
  _limit: number = 10,
  category?: string,
  brand?: string,
  _sort?: string,
  _order?: string
): Promise<{ data: IProduct[]; totalDocs: number }> => {
  // filter = {"category":["smartphone","laptops"]}
  // sort = {_sort:"price",_order="desc"}
  // pagination = {_page:1,_limit=10}
  let condition = { isActive: { $ne: false } };

  let query = Product.find(condition);
  let totalProductsQuery = Product.find(condition);
  // let query = Product.find();
  // let totalProductsQuery = Product.find();

  console.log(category);

  if (category) {
    query = query.find({ category: { $in: category.split(',') } });
    totalProductsQuery = totalProductsQuery.find({
      category: { $in: category.split(',') }
    });
  }
  if (brand) {
    query = query.find({ brand: { $in: brand.split(',') } });
    totalProductsQuery = totalProductsQuery.find({ brand: { $in: brand.split(',') } });
  }
  if (_sort && _order) {
    query = query.sort({ [_sort]: _order as SortOrder });
  }

  const totalDocs = await totalProductsQuery.countDocuments().exec();
  console.log({ totalDocs });

  if (_page && _limit) {
    const pageSize = _limit;
    const page = _page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  const docs = await query.exec();
  return {
    data: docs,
    totalDocs
  };
};

/**
 * Get products for admin
 * @returns {Promise<IProduct[]>}
 */
const getProductsAdmin = async (): Promise<{ data: IProduct[]; totalDocs: number }> => {
  const query = Product.find();
  const totalProductsQuery = Product.find();
  const totalDocs = await totalProductsQuery.countDocuments().exec();
  const docs = await query.exec();
  return {
    data: docs,
    totalDocs
  };
};

/**
 * Get product by id
 * @param {number} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<IProduct, Key> | null>}
 */
const getProductById = async <Key extends keyof IProduct>(
  id: number,
  keys: Key[] = ['_id', 'title', 'description', 'category', 'brand', 'isActive'] as Key[]
): Promise<Pick<IProduct, Key> | null> => {
  return Product.findById(id).select(keys.join(' ')).sort({ _id: 'asc' }).exec();
};

/**
 * Update product by id
 * @param {number} productId
 * @param {string} title
 * @param {string} description
 * @param {string} category
 * @param {string} brand
 * @param {string[]} images
 * @param {boolean} isActive
 * @returns {Promise<Product>}
 */
const updateProductById = async (
  productId: number,
  title: string,
  description: string,
  category: string,
  brand: string,
  images: string[],
  price: number,
  discountPercentage: number,
  rating: number,
  stock: number,
  isActive: boolean
): Promise<IProduct> => {
  let product = await Product.findByIdAndUpdate(
    productId,
    {
      title,
      description,
      category,
      brand,
      images,
      price,
      discountPercentage,
      rating,
      stock,
      isActive
    },
    { new: true }
  );
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  product.discountPrice = +(product.price * (1 - product.discountPercentage / 100)).toFixed(2);
  const updatedProduct = await product.save();

  return updatedProduct as IProduct;
};

/**
 * Delete product by id
 * @param {number} productId
 * @returns {Promise<Product>}
 */
const deleteProductById = async (productId: number): Promise<IProduct> => {
  return (await Product.findOneAndDelete({ _id: productId })) as IProduct;
};

/**
 * Deactivate/Restore product by id
 * @param {number} productId
 * @param {boolean} isActive
 * @returns {Promise<Product>}
 */
const deactivateOrRestoreProductById = async (productId: number, isActive: boolean) => {
  const product = await Product.findOneAndUpdate(
    { _id: productId },
    {
      isActive: !isActive
    },
    {
      new: true
    }
  );
  return product as IProduct;
};

/**
 * Update product image by id
 * @param {number} productId
 * @param {string} image
 * @returns {Promise<IProduct>}
 */
const updateProductImages = async (productId: number, image: string) => {};

export default {
  createProduct,
  getProducts,
  getProductsAdmin,
  getProductById,
  updateProductById,
  deleteProductById,
  deactivateOrRestoreProductById,
  updateProductImages
};
