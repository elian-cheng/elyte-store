import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import logger from '../config/logger';
import { productService } from '../services';
import { IUser } from '../models/User';

const createProduct = catchAsync(async (req, res) => {
  const {
    title,
    images,
    description,
    price,
    category,
    stock,
    brand,
    discountPercentage,
    colors,
    rating
  } = req.body;
  const product = await productService.createProduct(
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
  );
  res.status(httpStatus.CREATED).send(product);
  logger.info(`Product ${product.id} was created.`);
});

const getProducts = catchAsync(async (req, res) => {
  const admin = req.user as IUser;
  const { _page, _limit, category, brand, _sort, _order } = req.query;

  if (admin.role === 'admin') {
    const products = await productService.getProductsAdmin();
    res.status(httpStatus.OK).send(products);
  } else {
    const products = await productService.getProducts(
      _page ? +_page : undefined,
      _limit ? +_limit : undefined,
      category as string,
      brand as string,
      _sort as string,
      _order as string
    );
    res.status(httpStatus.OK).send(products);
  }
});

const getProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(+req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  res.send(product);
  logger.info(`Product ${product.id} was fetched.`);
});

const updateProduct = catchAsync(async (req, res) => {
  const {
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
  } = req.body;
  const product = await productService.updateProductById(
    req.params.productId,
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
  );
  res.send(product);
  logger.info(`Product ${product.id} was updated.`);
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProductById(+req.params.productId);
  res.status(httpStatus.NO_CONTENT).send({ message: 'Product deleted' });
  logger.info(`Product ${req.params.productId} was deleted.`);
});

const deactivateOrRestoreProduct = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  }
  await productService.deactivateOrRestoreProductById(product.id, product.isActive);
  res.locals.errorMessage = 'Product deactivated/restored successfully';
  res.status(httpStatus.NO_CONTENT).send({ message: 'Product deactivated/restored successfully' });
});

const updateProductImages = catchAsync(async (req, res) => {
  // const { image } = req.body;
  // const existingProduct = await productService.getProductById(req.params.productId);
  // if (!existingProduct) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
  // }
  // const product = await productService.updateProductImage(+req.params.productId, image);
  // res.send(product);
  // logger.info(`Product ${product.id} image was updated.`);
});

export default {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  deactivateOrRestoreProduct,
  updateProductImages
};
