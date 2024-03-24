import * as yup from 'yup';
import { CHECK_PHONE_SCHEMA, CHECK_PASSWORD_SCHEMA } from '../constants';

export const loginUserSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is a required field')
    .email('Email should have correct format'),
  password: yup.string().required('Please provide a password'),
});

export const changeRoleSchema = yup.object().shape({
  role: yup.string().required('Please choose role option'),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is a required field')
    .email('Email should have correct format'),
});

export const createNewPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .required('Please provide a password')
    .min(8, 'Password is too short - should be 8 chars minimum')
    .max(20, 'Password is too long - should be 20 chars maximum')
    .matches(
      CHECK_PASSWORD_SCHEMA,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required('Please provide a password'),
  newPassword: yup
    .string()
    .required('Please provide a password')
    .min(8, 'Password is too short - should be 8 chars minimum')
    .max(20, 'Password is too long - should be 20 chars maximum')
    .matches(
      CHECK_PASSWORD_SCHEMA,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
});

export const createUserProfileSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is a required field')
    .max(30, 'Name should not exceed 30 characters'),
  email: yup
    .string()
    .required('Email is a required field')
    .email('Email should have correct format'),
  password: yup
    .string()
    .required('Password is a required field')
    .min(8, 'Password is too short - should be 8 chars minimum')
    .max(20, 'Password is too long - should be 20 chars maximum')
    .matches(
      CHECK_PASSWORD_SCHEMA,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  role: yup.string().required('Please choose role option'),
  phone: yup
    .string()
    .trim()
    .ensure()
    .test(
      'is-empty-or-valid-office-phone',
      'Incorrect phone number. Please provide the number in format 14701234567 (including country code)',
      (value) => {
        if (!value || value.trim() === '') {
          return true;
        }
        return yup.string().matches(CHECK_PHONE_SCHEMA).isValidSync(value);
      }
    ),
});

export const updateUserProfileSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is a required field')
    .max(30, 'Name should not exceed 30 characters'),
  email: yup
    .string()
    .required('Email is a required field')
    .email('Email should have correct format'),
  phone: yup
    .string()
    .trim()
    .ensure()
    .test(
      'is-empty-or-valid-office-phone',
      'Incorrect phone number. Please provide the number in format 14701234567 (including country code)',
      (value) => {
        if (!value || value.trim() === '') {
          return true;
        }
        return yup.string().matches(CHECK_PHONE_SCHEMA).isValidSync(value);
      }
    ),
});
