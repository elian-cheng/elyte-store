import express from 'express';
import auth from '../middlewares/auth';
import validate from '../middlewares/validate';
import { Role } from '../utils/constants';
import { orderController } from '../controllers';
import { orderValidation } from '../validations';

const router = express.Router();

router.route('/admin').get(
  auth(Role.ADMIN),
  orderController.getOrdersAdmin
  /*
    #swagger.summary = 'Get orders for admin management'
    #swagger.tags = ['Orders']
    #swagger.security = [{Bearer: []}]
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/Order" },
      description: 'Orders fetched.'
    }
    #swagger.responses[401] = {
        description: 'No permission for this action',
        content: {
            'application/json': {
                schema: { $ref: '#/orders/schemas/ApiError' },
                example: {
                    code: 401,
                    message: 'Unauthorized'
                }
            }
        }
    }
     */
);

router
  .route('/')
  .post(
    auth(),
    validate(orderValidation.createOrder),
    orderController.createOrder
    /*
    #swagger.summary = 'Create an order'
    #swagger.tags = ['Orders']
    #swagger.security = [{Bearer: []}]
    #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      schema: {
        userData: {
          id: 'User ID',
          name: 'User Name',
          email: 'User Email',
          phone: 'User Phone',
          shippingInfo: {
            address: 'User Address',
            city: 'City',
            country: 'Country',
            state: 'State',
            zip: 'ZIP Code'
          }
        },
        orderItems: [
          {
            id: 'Product ID',
            title: 'Product Title',
            image: 'Product Image',
            price: 100.25,
            quantity: 1
          }
        ],
        paymentInfo: {
          stripeId: 'Stripe Payment ID',
          status: 'Payment Status'
        },
        totalPrice: 100.25,
        orderStatus: 'Order Status',
        paidAt: 'Payment Date'
       }
    }

    #swagger.responses[201] = {
       schema: { $ref: "#/definitions/Order" },
        description: 'Order created.'
     }
    #swagger.responses[400] = {
        description: 'Data validation error',
        content: {
            'application/json': {
                schema: { $ref: '#/orders/schemas/ApiError' },
                example: {
                    code: 400,
                    message: 'Validation error'
                }
            }
        }
    }
    #swagger.responses[401] = {
        description: 'No permission for this action',
        content: {
            'application/json': {
                schema: { $ref: '#/orders/schemas/ApiError' },
                example: {
                    code: 401,
                    message: 'Unauthorized'
                }
            }
        }
    }
     */
  )
  .get(
    auth(),
    orderController.getOrders
    /*
    #swagger.summary = 'Get orders'
    #swagger.tags = ['Orders']
    #swagger.security = [{Bearer: []}]
    #swagger.parameters['_page'] = {
      in: 'query',
      type: 'number',
      description: 'Page number.'
    }
    #swagger.parameters['_limit'] = {
      in: 'query',
      type: 'number',
      description: 'Number of orders per page.'
    }
    #swagger.parameters['user'] = {
      in: 'query',
      type: 'string',
      description: 'User ID.'
    }
    #swagger.parameters['_sort'] = {
      in: 'query',
      type: 'string',
      description: 'Sort by field.'
    }
    #swagger.parameters['_order'] = {
      in: 'query',
      type: 'string',
      description: 'Sort order.'
    }

    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/Order" },
      description: 'Orders fetched.'
    }
    #swagger.responses[401] = {
        description: 'No permission for this action',
        content: {
            'application/json': {
                schema: { $ref: '#/orders/schemas/ApiError' },
                example: {
                    code: 401,
                    message: 'Unauthorized'
                }
            }
        }
    }
     */
  );

router
  .route('/:orderId')
  .get(
    auth(Role.ADMIN),
    validate(orderValidation.getOrder),
    orderController.getOrder
    /*
    #swagger.summary = 'Get order by Id'
    #swagger.tags = ['Orders']
    #swagger.security = [{Bearer: []}]
    #swagger.parameters['orderId'] = {
      in: 'path',
      type: 'string',
      description: 'Order ID.'
    }

    #swagger.responses[200] = {
        schema: { $ref: "#/definitions/Order" },
        description: 'Order fetched.'
      }
    #swagger.responses[401] = {
        description: 'No permission for this action',
        content: {
            'application/json': {
                schema: { $ref: '#/orders/schemas/ApiError' },
                example: {
                    code: 401,
                    message: 'Unauthorized'
                }
            }
        }
    }
    #swagger.responses[404] = {
        description: 'No order found with this ID.',
        content: {
            'application/json': {
                schema: { $ref: '#/orders/schemas/ApiError' },
                example: {
                    code: 404,
                    message: 'Order not found'
                }
            }
        }
    }
     */
  )
  .patch(
    auth(Role.ADMIN),
    validate(orderValidation.updateOrder),
    orderController.updateOrder
    /*
    #swagger.summary = 'Update order by Id'
    #swagger.tags = ['Orders']
    #swagger.security = [{Bearer: []}]
    #swagger.parameters['orderId'] = {
      in: 'path',
      type: 'string',
      description: 'Order ID.'
    }
    #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        schema: {
          userData: {
            name: 'Updated User Name',
            email: 'Updated User Email',
            phone: 'Updated User Phone',
            shippingInfo: {
              address: 'Updated Address',
              city: 'Updated City',
              country: 'Updated Country',
              state: 'Updated State',
              zip: 'Updated ZIP Code'
            }
          },
          orderItems: [
            {
              id: 'Updated Product ID',
              title: 'Updated Product Title',
              image: 'Updated Product Image',
              price: 150.50,
              quantity: 2
            }
          ],
          paymentInfo: {
            stripeId: 'Updated Stripe Payment ID',
            status: 'Updated Payment Status'
          },
          totalPrice: 150.50,
          orderStatus: 'Updated Order Status',
          paidAt: 'Updated Payment Date'
        }
    }

    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/Order" },
      description: 'Order updated.'
    }
    #swagger.responses[400] = {
        description: 'Data validation error',
        content: {
            'application/json': {
                schema: { $ref: '#/orders/schemas/ApiError' },
                example: {
                    code: 400,
                    message: 'Validation error'
                }
            }
        }
    }
    #swagger.responses[401] = {
        description: 'No permission for this action',
        content: {
            'application/json': {
                schema: { $ref: '#/orders/schemas/ApiError' },
                example: {
                    code: 401,
                    message: 'Unauthorized'
                }
            }
        }
    }
    #swagger.responses[404] = {
        description: 'No order found with this ID.',
        content: {
            'application/json': {
                schema: { $ref: '#/orders/schemas/ApiError' },
                example: {
                    code: 404,
                    message: 'Order not found'
                }
            }
        }
    }
     */
  )
  .delete(
    auth(Role.ADMIN),
    validate(orderValidation.deleteOrder),
    orderController.deleteOrder
    /*
    #swagger.summary = 'Delete order by Id'
    #swagger.tags = ['Orders']
    #swagger.security = [{Bearer: []}]
    #swagger.parameters['orderId'] = {
      in: 'path',
      type: 'string',
      description: 'Order ID.'
    }

    #swagger.responses[204] = {
        description: 'Order deleted.'
      }
    #swagger.responses[401] = {
        description: 'No permission for this action',
        content: {
            'application/json': {
                schema: { $ref: '#/orders/schemas/ApiError' },
                example: {
                    code: 401,
                    message: 'Unauthorized'
                }
            }
        }
    }
    #swagger.responses[404] = {
        description: 'No order found with this ID.',
        content: {
            'application/json': {
                schema: { $ref: '#/orders/schemas/ApiError' },
                example: {
                    code: 404,
                    message: 'Order not found'
                }
            }
        }
    }
     */
  );

export default router;
