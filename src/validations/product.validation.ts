import Joi, { object } from 'joi';
import { CHECK_IMAGE_BUCKET } from '../utils/constants';
import { objectId } from './custom.validation';

const createProduct = {
  body: Joi.object().keys({
    title: Joi.string().required().max(20),
    category: Joi.string().required().max(30),
    images: Joi.array()
      .items(Joi.string().regex(CHECK_IMAGE_BUCKET).max(150).allow(''))
      .min(1)
      .max(4),
    description: Joi.string().required().max(1500),
    price: Joi.number().positive().precision(2).required(),
    discountPercentage: Joi.number().precision(2).min(0).max(99).default(0),
    rating: Joi.number().positive().precision(2).required(),
    stock: Joi.number().integer().positive().required(),
    brand: Joi.string().required().max(20),
    colors: Joi.array().items(Joi.string().max(20))
  })
};

const getProducts = {
  query: Joi.object().keys({
    page: Joi.string().regex(/^\d+$/).min(1),
    limit: Joi.string().regex(/^\d+$/).min(1)
  })
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().required().custom(objectId)
  })
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().required().custom(objectId)
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().required().max(20),
      category: Joi.string().required().max(30),
      images: Joi.array()
        .items(Joi.string().regex(CHECK_IMAGE_BUCKET).max(150).allow(''))
        .min(1)
        .max(4),
      description: Joi.string().required().max(1500),
      price: Joi.number().precision(2).required(),
      discountPercentage: Joi.number().precision(2).min(0).max(99).default(0),
      rating: Joi.number().precision(2).required(),
      stock: Joi.number().integer().required(),
      brand: Joi.string().required().max(20),
      colors: Joi.array().items(Joi.string().max(20))
    })
    .min(1)
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().required().custom(objectId)
  })
};

const deactivateProduct = {
  params: Joi.object().keys({
    productId: Joi.string().required().custom(objectId)
  })
};

const updateProductImages = {
  params: Joi.object().keys({
    productId: Joi.string().required().custom(objectId)
  }),
  body: Joi.object().keys({
    images: Joi.array()
      .items(Joi.string().regex(CHECK_IMAGE_BUCKET).max(100).allow(''))
      .min(1)
      .max(4)
  })
};

export default {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  deactivateProduct,
  updateProductImages
};
