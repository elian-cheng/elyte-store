import express from 'express';
import docsRoute from './docs.route';
import authRoute from './auth.route';
import usersRoute from './user.route';
import productsRoute from './product.route';
import paymentsRoute from './payment.route';
import ordersRoute from './order.route';
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

router.use(
  '/payments',
  paymentsRoute
  /*
    #swagger.tags = ['Payments']
   */
);

router.use(
  '/orders',
  ordersRoute
  /*
    #swagger.tags = ['Orders']
   */
);

export default router;
