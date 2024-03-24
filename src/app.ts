import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import httpStatus from 'http-status';
import config from './config/config';
import morgan from './config/morgan';
import xss from './middlewares/xss';
import { jwtStrategy } from './config/passport';
import { authLimiter } from './middlewares/rateLimiter';
import routes from './routes';
import { errorConverter, errorHandler } from './middlewares/error';
import ApiError from './utils/ApiError';
import Product, { IProduct } from './models/Product';
import User from './models/User';
import { encryptPassword } from './utils/encryption';
const fs = require('fs');
const path = require('path');

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/auth', authLimiter);
}

// v1 api routes
app.use(routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

async function main() {
  const products = await Product.find({}).exec();
  const users = await User.find({}).exec();

  if (products.length === 0) {
    const rawData = fs.readFileSync(path.join(__dirname, '../lib/products.json'), 'utf8');
    const productsData = JSON.parse(rawData);
    const convertedProductsData = productsData.map((product: any) => {
      const { id, ...productWithoutId } = product;
      productWithoutId.colors = [productWithoutId.color];
      return productWithoutId;
    });
    await Product.create(convertedProductsData);
    console.log('products created');
  }
  if (users.length === 0) {
    const rawData = fs.readFileSync(path.join(__dirname, '../lib/users.json'), 'utf8');
    const usersData = JSON.parse(rawData);
    const convertedUsersData = await Promise.all(
      usersData.map(async (user: any) => {
        user.password = await encryptPassword(user.password);
        return user;
      })
    );
    await User.create(convertedUsersData);
    console.log('users created');
  }
}
main().catch((err) => console.log(err));

export default app;
