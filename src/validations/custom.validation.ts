import Joi from 'joi';
import { CHECK_PASSWORD_SCHEMA } from '../utils/constants';

export const password: Joi.CustomValidator<string> = (value, helpers) => {
  if (value.length < 8) {
    return helpers.error('Password is too short - should be 8 chars minimum.');
  }
  if (value.length > 20) {
    return helpers.error('Password is too long - should be 20 chars maximum.');
  }
  if (!value.match(CHECK_PASSWORD_SCHEMA)) {
    return helpers.error(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    );
  }
  return value;
};

export const objectId: Joi.CustomValidator<string> = (value, helpers) => {
  const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

  if (!isValidObjectId(value)) {
    return helpers.error('Invalid ObjectId');
  }
  return value;
};
