import express from 'express';
import auth from '../middlewares/auth';
import validate from '../middlewares/validate';
import productValidation from '../validations/product.validation';
import productController from '../controllers/product.controller';
import { Role } from '../utils/constants';

const router = express.Router();

router.route('/admin').get(
  auth(Role.ADMIN),
  productController.getProductsAdmin
  /*
    #swagger.summary = 'Get products for admin management'
    #swagger.tags = ['Products']
    #swagger.security = [{Bearer: []}]
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/Product" },
      description: 'Products fetched.'
    }
    #swagger.responses[401] = {
        description: 'No permission for this action',
        content: {
            'application/json': {
                schema: { $ref: '#/products/schemas/ApiError' },
                example: {
                    code: 401,
                    message: 'Unauthorized'
                }
            }
        }
    }
     */
);

router.route('/images/:productId').patch(
  auth(Role.ADMIN),
  validate(productValidation.updateProductImages),
  productController.updateProductImages
  /*
    #swagger.summary = 'Update product images by product Id'
    #swagger.tags = ['Products']
    #swagger.security = [{Bearer: []}]
    #swagger.parameters['productId'] = {
      in: 'path',
      type: 'number',
      description: 'Product id.'
      }
    }
    #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        schema: {
          image: 'Product Image',
        }
    }
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/Product" },
      description: 'Product updated.'
    }
    #swagger.responses[401] = {
        description: 'No permission for this action',
        content: {
            'application/json': {
                schema: { $ref: '#/products/schemas/ApiError' },
                example: {
                    code: 401,
                    message: 'Unauthorized'
                }
            }
        }
    }
    #swagger.responses[404] = {
        description: 'There is no product with this ID in a database.',
        content: {
            'application/json': {
                schema: { $ref: '#/products/schemas/ApiError' },
                example: {
                    code: 404,
                    message: 'Product not found'
                }
            }
        }
    }
     */
);

router.route('/deactivate/:productId').patch(
  auth(Role.ADMIN),
  validate(productValidation.deactivateProduct),
  productController.deactivateOrRestoreProduct
  /*
    #swagger.summary = 'Deactivate or restore product by ID'
    #swagger.tags = ['Products']
    #swagger.security = [{Bearer: []}]
    #swagger.parameters['productId'] = {
      in: 'path',
      description: 'ID of the product to deactivate/restore.',
      required: true,
      type: 'string'
    }
    #swagger.responses[204] = {
          content: {
              "application/json": {
                  example: { message: 'Product deactivated/restored successfully' }
              }
          },
          description: 'Product deactivated/restored successfully.'
    }
    #swagger.responses[404] = {
        description: 'There is no product with this ID in a database.',
        content: {
            'application/json': {
                schema: { $ref: '#/products/schemas/ApiError' },
                example: {
                    code: 404,
                    message: 'Product not found'
                }
            }
        }
    }
    #swagger.responses[401] = {
          description: 'No permission for this action',
          content: {
              'application/json': {
                  schema: { $ref: '#/products/schemas/ApiError' },
                  example: {
                      code: 401,
                      message: 'Unauthorized'
                  }
              }
          }
      }

      #swagger.description = 'Deactivate or restore product by productId.'
      #swagger.produces = ["application/json"]
      #swagger.consumes = ["application/json"]
  */
);

router
  .route('/')
  .post(
    auth(Role.ADMIN),
    validate(productValidation.createProduct),
    productController.createProduct
    /*
    #swagger.summary = 'Create a product'
    #swagger.tags = ['Products']
    #swagger.security = [{Bearer: []}]
    #swagger.parameters['body'] = {
      in: 'body',
      type: 'object',
      schema: {
        title: 'Product Title',
        images: 'Product Images',
        category: 'Category',
        description: 'Product Description',
        price: 100.25,
        discountPercentage: 10,
       }
    }

    #swagger.responses[201] = {
       schema: { $ref: "#/definitions/Product" },
        description: 'Product created.'
     }
    #swagger.responses[400] = {
        description: 'Data validation error',
        content: {
            'application/json': {
                schema: { $ref: '#/products/schemas/ApiError' },
                example: {
                    code: 400,
                    message: 'Product code already exists'
                }
            }
        }
    }
    #swagger.responses[401] = {
        description: 'No permission for this action',
        content: {
            'application/json': {
                schema: { $ref: '#/products/schemas/ApiError' },
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
    productController.getProducts
    /*
    #swagger.summary = 'Get products'
    #swagger.tags = ['Products']
    #swagger.security = [{Bearer: []}]
    #swagger.parameters['_page'] = {
      in: 'query',
      type: 'number',
      description: 'Page number.'
    }
    #swagger.parameters['_limit'] = {
      in: 'query',
      type: 'number',
      description: 'Number of products per page.'
    }
    #swagger.parameters['category'] = {
      in: 'query',
      type: 'string',
      description: 'Category name.'
    }
    #swagger.parameters['brand'] = {
      in: 'query',
      type: 'string',
      description: 'Brand name.'
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
      schema: { $ref: "#/definitions/Product" },
      description: 'Products fetched.'
    }
    #swagger.responses[401] = {
        description: 'No permission for this action',
        content: {
            'application/json': {
                schema: { $ref: '#/products/schemas/ApiError' },
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
  .route('/:productId')
  .get(
    validate(productValidation.getProduct),
    productController.getProduct
    /*
    #swagger.summary = 'Get product by Id'
    #swagger.tags = ['Products']
    #swagger.security = [{Bearer: []}]
    #swagger.parameters['productId'] = {
      in: 'path',
      type: 'number',
      description: 'Product id.'
      }

    #swagger.responses[200] = {
        schema: { $ref: "#/definitions/Product" },
        description: 'Product fetched.'
      }
    #swagger.responses[401] = {
        description: 'No permission for this action',
        content: {
            'application/json': {
                schema: { $ref: '#/products/schemas/ApiError' },
                example: {
                    code: 401,
                    message: 'Unauthorized'
                }
            }
        }
    }
    #swagger.responses[404] = {
        description: 'There is no product with this ID in a database.',
        content: {
            'application/json': {
                schema: { $ref: '#/products/schemas/ApiError' },
                example: {
                    code: 404,
                    message: 'Product not found'
                }
            }
        }
    }
     */
  )
  .patch(
    auth(Role.ADMIN),
    validate(productValidation.updateProduct),
    productController.updateProduct
    /*
    #swagger.summary = 'Update product by Id'
    #swagger.tags = ['Products']
    #swagger.security = [{Bearer: []}]
    #swagger.parameters['productId'] = {
      in: 'path',
      type: 'number',
      description: 'Product id.'
      }
    }
    #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        schema: {
          code: 'Product Code',
          UOM: 'Product UOM',
          image: 'Product Image',
          category: 'Category',
          type: 'Product Type',
          typeES: 'Product Type ES',
          description: 'Product Description',
          descriptionES: 'Product Description ES',
          isActive: true,
          netWeight: 1000,
          grossWeight: 1500
        }
    }
    #swagger.responses[200] = {
      schema: { $ref: "#/definitions/Product" },
      description: 'Product updated.'
    }
    #swagger.responses[400] = {
        description: 'Data validation error',
        content: {
            'application/json': {
                schema: { $ref: '#/products/schemas/ApiError' },
                example: {
                    code: 400,
                    message: 'Product code already exists'
                }
            }
        }
    }
    #swagger.responses[401] = {
        description: 'No permission for this action',
        content: {
            'application/json': {
                schema: { $ref: '#/products/schemas/ApiError' },
                example: {
                    code: 401,
                    message: 'Unauthorized'
                }
            }
        }
    }
    #swagger.responses[404] = {
        description: 'There is no product with this ID in a database.',
        content: {
            'application/json': {
                schema: { $ref: '#/products/schemas/ApiError' },
                example: {
                    code: 404,
                    message: 'Product not found'
                }
            }
        }
    }
     */
  )
  .delete(
    auth(Role.ADMIN),
    validate(productValidation.deleteProduct),
    productController.deleteProduct
    /*
    #swagger.summary = 'Delete product by Id'
    #swagger.tags = ['Products']
    #swagger.security = [{Bearer: []}]
    #swagger.parameters['productId'] = {
      in: 'path',
      type: 'number',
      description: 'Product id.'
      }

    #swagger.responses[204] = {
        description: 'Product deleted.'
      }
    #swagger.responses[401] = {
        description: 'No permission for this action',
        content: {
            'application/json': {
                schema: { $ref: '#/products/schemas/ApiError' },
                example: {
                    code: 401,
                    message: 'Unauthorized'
                }
            }
        }
    }
    #swagger.responses[404] = {
        description: 'There is no product with this ID in a database.',
        content: {
            'application/json': {
                schema: { $ref: '#/products/schemas/ApiError' },
                example: {
                    code: 404,
                    message: 'Product not found'
                }
            }
        }
    }
     */
  );

export default router;
