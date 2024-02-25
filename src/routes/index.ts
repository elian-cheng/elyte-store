import express from 'express';
import docsRoute from './docs.route';
import authRoute from './auth.route';
import usersRoute from './user.route';
import productsRoute from './product.route';
import healthCheckRoute from './healthCheck.route';

const router = express.Router();

router.use(
  '/',
  healthCheckRoute
  /*
  #swagger.tags = ['HealthCheck']
   */
);

router.use(
  '/docs',
  docsRoute
  /*
   */
);

router.use(
  '/users',
  usersRoute
  /*
    #swagger.tags = ['Users']
   */
);

router.use(
  '/auth',
  authRoute
  /*
    #swagger.tags = ['Auth']
   */
);

router.use(
  '/products',
  productsRoute
  /*
    #swagger.tags = ['Products']
   */
);

export default router;
