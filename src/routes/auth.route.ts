import express from 'express';
import validate from '../middlewares/validate';
import authValidation from '../validations/auth.validation';
import { authController } from '../controllers';
import auth from '../middlewares/auth';
import { Role } from '../utils/constants';

const router = express.Router();

router.post(
  '/register',
  validate(authValidation.register),
  authController.register
  /*
    #swagger.summary = 'Register'
    #swagger.tags = ['Users']
    #swagger.security = [{Bearer: []}]
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
                  $email: 'john.doe@example.com',
                  $password: 'Password1*',
                }
    }

    #swagger.responses[201] = {
        description: 'Created',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/User' }
            }
        }
    }
     #swagger.responses[400] = {
        description: 'Email already taken',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                example: {
                    code: 400,
                    message: 'Email already taken'
                }
            }
        }
    }
    */
);

router.route('/login').post(
  validate(authValidation.login),
  authController.login
  /*
    #swagger.summary = 'Login'
    #swagger.tags = ['Auth']
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            $email: 'john.doe@example.com',
            $password: 'Password1*'
        },
    }

    #swagger.responses[200] = {
        description: 'OK',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/User' }
            }
        }
    }
    #swagger.responses[401] = {
        description: 'Incorrect credentials',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                example: {
                    code: 401,
                    message: 'Incorrect credentials'
                }
            }
        }
    }
    */
);

router.route('/logout').post(
  validate(authValidation.logout),
  authController.logout
  /*
    #swagger.summary = 'Logout'
    #swagger.tags = ['Auth']
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            $refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg'
        },
    }

    #swagger.responses[204] = {
        description: 'No content'
    }
    #swagger.responses[404] = {
        description: 'Not found',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                example: {
                    code: 404,
                    message: 'Not found'
                }
            }
        }
    }
    */
);

router.route('/refresh-tokens').post(
  validate(authValidation.refreshTokens),
  authController.refreshTokens
  /*
    #swagger.summary = 'Refresh auth tokens'
    #swagger.tags = ['Auth']
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            $refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1ZWJhYzUzNDk1NGI1NDEzOTgwNmMxMTIiLCJpYXQiOjE1ODkyOTg0ODQsImV4cCI6MTU4OTMwMDI4NH0.m1U63blB0MLej_WfB7yC2FTMnCziif9X8yzwDEfJXAg'
        },
    }

    #swagger.responses[200] = {
        description: 'OK',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/Token' }
            }
        }
    }
    #swagger.responses[401] = {
        $ref: '#/components/responses/Unauthorized'
    }
    */
);

router.route('/forgot-password').post(
  validate(authValidation.forgotPassword),
  authController.forgotPassword
  /*
    #swagger.summary = 'Forgot password'
    #swagger.description = 'An email will be sent to reset password.'
    #swagger.tags = ['Auth']
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            $email: 'johndoe@test.com'
        },
    }

    #swagger.responses[204] = {
        description: 'No content'
    }
    #swagger.responses[404] = {
        description: 'Not found',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                example: {
                    code: 404,
                    message: 'Not found'
                }
            }
        }
    }
    */
);

router.route('/reset-password').post(
  validate(authValidation.resetPassword),
  authController.resetPassword
  /*
    #swagger.summary = 'Reset password'
    #swagger.tags = ['Auth']
    #swagger.parameters['token'] = {
        in: 'query',
        required: true,
        type: 'string',
        description: 'The reset password token'
    }
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            $password: 'Password1*'
        },
    }

    #swagger.responses[204] = {
        description: 'No content'
    }
    #swagger.responses[401] = {
        description: 'Password reset failed',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                example: {
                    code: 401,
                    message: 'Password reset failed'
                }
            }
        }
    }
    */
);

router.route('/admin/change-password/:userId').patch(
  auth(Role.ADMIN),
  validate(authValidation.adminChangeUserPassword),
  authController.adminChangeUserPassword
  /*
    #swagger.summary = 'Change user password for admin'
    #swagger.tags = ['Auth']
    #swagger.security = [{Bearer: []}]
    #swagger.parameters['userId'] = {
    in: 'path',
    description: 'ID of the user whose password should be updated.',
    required: true,
    type: 'string'
    }
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            $password: 'Password1*'
        },
    }
    #swagger.responses[204] = {
          content: {
              "application/json": {
                  example: { message: 'Password updated successfully' }
              }
          },
          description: 'Password updated successfully.'
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
        description: 'Not found',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                example: {
                    code: 404,
                    message: 'Not found'
                }
            }
        }
    }
    */
);

router.route('/change-password/:userId').patch(
  auth(),
  validate(authValidation.userChangePassword),
  authController.userChangePassword
  /*
    #swagger.summary = 'Change user password'
    #swagger.tags = ['Auth']
    #swagger.security = [{Bearer: []}]
    #swagger.parameters['userId'] = {
    in: 'path',
    description: 'ID of the user whose password should be updated.',
    required: true,
    type: 'string'
    }
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            $oldPassword: 'Password1*',
            $newPassword: 'Password2*'
        },
    }
    #swagger.responses[204] = {
          content: {
              "application/json": {
                  example: { message: 'Password updated successfully' }
              }
          },
          description: 'Password updated successfully.'
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
        description: 'Not found',
        content: {
            'application/json': {
                schema: { $ref: '#/components/schemas/ApiError' },
                example: {
                    code: 404,
                    message: 'Not found'
                }
            }
        }
    }
    */
);

export default router;
