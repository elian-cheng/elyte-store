import Joi from 'joi';
import { objectId } from './custom.validation';
import { CHECK_PHONE_SCHEMA, Role } from '../utils/constants';

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId)
  })
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId)
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().required(),
      email: Joi.string().required().email()
    })
    .min(1)
};

const updateUserRole = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId)
  }),
  body: Joi.object().keys({
    role: Joi.string().required().valid(Role.ADMIN, Role.USER).default(Role.USER)
  })
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId)
  })
};

const banUser = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId)
  })
};

export default {
  getUser,
  updateUser,
  deleteUser,
  updateUserRole,
  banUser
};
