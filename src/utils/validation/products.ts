import * as yup from 'yup';
import {
  CHECK_INTEGER_SCHEMA,
  CHECK_PERCENT_SCHEMA,
  CHECK_PRICE_SCHEMA,
  CHECK_RATING_SCHEMA,
} from '../constants';

export const updateProductFormSchema = yup.object().shape({
  title: yup.string().required('Title is a required field'),
  description: yup.string().required('Description is a required field'),
  category: yup.string().required('Category is a required field'),
  brand: yup.string().required('Brand is a required field'),
  images: yup.array().of(yup.string().required('Image is a required field')),
  colors: yup.array().of(yup.string()),
  price: yup
    .string()
    .required('Price is a required field')
    .matches(
      CHECK_PRICE_SCHEMA,
      'Price should be a valid integer/float number (e.g. 10.55)'
    ),
  discountPercentage: yup
    .string()
    .trim()
    .ensure()
    .test(
      'is-empty-or-valid-discount-percentage',
      'Discount should be a valid integer/float number (e.g. 10.55)',
      (value) => {
        if (!value || value.trim() === '') {
          return true;
        }
        return yup.string().matches(CHECK_PERCENT_SCHEMA).isValidSync(value);
      }
    ),
  rating: yup
    .string()
    .trim()
    .ensure()
    .test(
      'is-empty-or-valid-rating',
      'Rating should be a valid integer/float number (e.g. 4.55)',
      (value) => {
        if (!value || value.trim() === '') {
          return true;
        }
        return yup.string().matches(CHECK_RATING_SCHEMA).isValidSync(value);
      }
    ),
  stock: yup
    .string()
    .required('Stock is a required field')
    .matches(
      CHECK_INTEGER_SCHEMA,
      'Stock should be a valid integer number (e.g. 15)'
    ),
  isActive: yup.boolean(),
});

export const createProductFormSchema = yup.object().shape({
  title: yup.string().required('Title is a required field'),
  description: yup.string().required('Description is a required field'),
  category: yup.string().required('Category is a required field'),
  brand: yup.string().required('Brand is a required field'),
  images: yup.array().of(yup.string().required('Image is a required field')),
  colors: yup.array().of(yup.string()),
  price: yup
    .string()
    .required('Price is a required field')
    .matches(
      CHECK_PRICE_SCHEMA,
      'Price should be a valid integer/float number (e.g. 10.55)'
    ),
  discountPercentage: yup
    .string()
    .trim()
    .ensure()
    .test(
      'is-empty-or-valid-discount-percentage',
      'Discount should be a valid integer/float number (e.g. 10.55)',
      (value) => {
        if (!value || value.trim() === '') {
          return true;
        }
        return yup.string().matches(CHECK_PERCENT_SCHEMA).isValidSync(value);
      }
    ),
  rating: yup
    .string()
    .trim()
    .ensure()
    .test(
      'is-empty-or-valid-rating',
      'Rating should be a valid integer/float number (e.g. 10.55)',
      (value) => {
        if (!value || value.trim() === '') {
          return true;
        }
        return yup.string().matches(CHECK_RATING_SCHEMA).isValidSync(value);
      }
    ),
  stock: yup
    .string()
    .required('Stock is a required field')
    .matches(
      CHECK_INTEGER_SCHEMA,
      'Stock should be a valid integer number (e.g. 15)'
    ),
});

export const updateProductImagesFormSchema = yup.object().shape({
  images: yup.array().of(
    yup.object().shape({
      url: yup.string().required('URL is a required field'),
    })
  ),
});
