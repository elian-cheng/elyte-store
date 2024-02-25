import express from 'express';
import auth from '../middlewares/auth';
import validate from '../middlewares/validate';
import { userValidation } from '../validations';
import { userController } from '../controllers';
import { Role } from '../utils/constants';

const router = express.Router();

router.route('/role/:userId').patch(
  auth(Role.ADMIN),
  validate(userValidation.updateUserRole),
  userController.updateUserRole
  /*
  #swagger.summary = 'Update user role by user ID'
  #swagger.tags = ['Users']
  #swagger.security = [{Bearer: []}]
  #swagger.parameters['userId'] = {
  in: 'path',
  description: 'ID of the user whose role should be updated.',
  required: true,
  type: 'string'
}
  #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
               $role: {
                '@enum': ['ADMIN', 'USER']
              }
          }
  }

  #swagger.responses[200] = {
      content: {
          "application/json": {
              schema: { $ref: "#/definitions/User" }
          }
      },
      description: 'User updated successfully.'
  }
  #swagger.responses[401] = {
      description: 'No permission for this action',
      content: {
          'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
              example: {
                  code: 401,
                  message: 'Unauthorized'
              }
          }
      }
  }

  #swagger.description = 'Update user roles.'
  #swagger.produces = ["application/json"]
  #swagger.consumes = ["application/json"]
  */
);

router.route('/ban/:userId').patch(
  auth(Role.ADMIN),
  validate(userValidation.banUser),
  userController.banOrRestoreUser
  /*
    #swagger.summary = 'Ban or restore user by ID'
    #swagger.tags = ['Users']
    #swagger.security = [{Bearer: []}]
    #swagger.parameters['userId'] = {
      in: 'path',
      description: 'ID of the user to ban / restore.',
      required: true,
      type: 'string'
    }
    #swagger.responses[204] = {
          content: {
              "application/json": {
                  example: { message: 'User banned/restored successfully' }
              }
          },
          description: 'User updated successfully.'
    }
    #swagger.responses[404] = {
        description: 'There is no user with this ID in a database.',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                example: {
                    code: 404,
                    message: 'User not found'
                }
            }
        }
    }
    #swagger.responses[401] = {
          description: 'No permission for this action',
          content: {
              'application/json': {
                  schema: { $ref: '#/components/schemas/ApiError' },
                  example: {
                      code: 401,
                      message: 'Unauthorized'
                  }
              }
          }
      }

      #swagger.description = 'Ban or restore user by userId.'
      #swagger.produces = ["application/json"]
      #swagger.consumes = ["application/json"]
  */
);

router.route('/').get(
  auth(Role.ADMIN),
  userController.getUsers
  /*
      #swagger.summary = 'Get users'
      #swagger.tags = ['Users']
      #swagger.security = [{Bearer: []}]

      #swagger.responses[200] = {
          content: {
              "application/json": {
                  schema: { $ref: "#/definitions/User" }
              }
          },
          description: 'Users retrieved successfully.'
      }

      #swagger.responses[401] = {
        description: 'No permission for this action',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                example: {
                    code: 401,
                    message: 'Unauthorized'
                }
            }
        }
    }

      #swagger.description = 'Receive all users.'
      #swagger.produces = ["application/json"]
      #swagger.consumes = ["application/json"]
      */
);

router
  .route('/:userId')
  .get(
    auth(Role.ADMIN),
    validate(userValidation.getUser),
    userController.getUser
    /*
    #swagger.summary = 'Get user by ID'
    #swagger.tags = ['Users']
    #swagger.security = [{Bearer: []}]
    #swagger.parameters['userId'] = {
    in: 'path',
    description: 'The ID of the user to retrieve.',
    required: true,
    type: 'string'
    }

     #swagger.responses[200] = {
        content: {
            "application/json": {
                schema: { $ref: "#/definitions/User" }
            }
        },
        description: 'User retrieved successfully.'
    }
    #swagger.responses[401] = {
        description: 'No permission for this action',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                example: {
                    code: 401,
                    message: 'Unauthorized'
                }
            }
        }
    }
    #swagger.responses[404] = {
        description: 'There is no user with this ID in a database.',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                example: {
                    code: 404,
                    message: 'User not found'
                }
            }
        }
    }*/
  )
  .patch(
    auth(),
    validate(userValidation.updateUser),
    userController.updateUser
    /*
    #swagger.summary = 'Update user by ID'
    #swagger.tags = ['Users']
    #swagger.security = [{Bearer: []}]
    #swagger.parameters['userId'] = {
    in: 'path',
    description: 'The ID of the user to update.',
    required: true,
    type: 'string'
    }
     #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
                  name: 'John Doe',
                  email: 'john.doe@example.com',
                  phone: '12345678901',
                }
    }

    #swagger.responses[200] = {
        content: {
            "application/json": {
                schema: { $ref: "#/definitions/User" }
            }
        },
        description: 'Users updated successfully.'
    }
    #swagger.responses[401] = {
        description: 'No permission for this action',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                example: {
                    code: 401,
                    message: 'Unauthorized'
                }
            }
        }
    }

    #swagger.description = 'Update of user fields by clerkId.'
    #swagger.produces = ["application/json"]
    #swagger.consumes = ["application/json"]
    */
  )
  .delete(
    auth(Role.ADMIN),
    validate(userValidation.deleteUser),
    userController.deleteUser

    /*
    #swagger.summary = 'Delete user by ID'
    #swagger.tags = ['Users']
    #swagger.security = [{Bearer: []}]
    #swagger.parameters['userId'] = {
    in: 'path',
    description: 'ID of the user to delete.',
    required: true,
    type: 'string'
    }

    #swagger.responses[204] = {
        content: {
            "application/json": {
                example: {
                 message: 'User deleted',
                 }
            }
        },
        description: 'User deleted successfully.'
    }
    #swagger.responses[401] = {
        description: 'No permission for this action',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                example: {
                    code: 401,
                    message: 'Unauthorized'
                }
            }
        }
    }

    #swagger.description = 'Delete users.'
    #swagger.produces = ["application/json"]
    #swagger.consumes = ["application/json"]
*/
  );

export default router;
