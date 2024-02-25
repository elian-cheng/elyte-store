import httpStatus from 'http-status';
import tokenService from './token.service';
import userService from './user.service';
import ApiError from '../utils/ApiError';
import { encryptPassword, isPasswordMatch } from '../utils/encryption';
import { AuthTokensResponse } from '../types/response';
import exclude from '../utils/exclude';
import User, { IUser } from '../models/User';
import { Role, TokenType } from '../utils/constants';
import Token from '../models/Token';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Omit<User, 'password'>>}
 */
const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<Omit<IUser, 'password'>> => {
  const user = await userService.getUserByEmail(email, [
    '_id',
    'email',
    'name',
    'password',
    'isBanned',
    'role',
    'createdAt',
    'updatedAt'
  ]);
  if (!user || !(await isPasswordMatch(password, user.password as string))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect credentials');
  }
  return exclude(user, ['password']) as Omit<IUser, 'password'>;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenData = await Token.findOne({
    token: refreshToken,
    type: TokenType.REFRESH,
    isBlacklisted: false
  }).exec();

  if (!refreshTokenData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }

  await Token.findByIdAndDelete(refreshTokenData.id);
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<AuthTokensResponse>}
 */
const refreshAuth = async (refreshToken: string): Promise<AuthTokensResponse> => {
  try {
    const refreshTokenData = await tokenService.verifyToken(refreshToken, TokenType.REFRESH);
    const { userId, role } = refreshTokenData;
    await Token.findByIdAndDelete(refreshTokenData._id);
    return tokenService.generateAuthTokens(userId, role as Role);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token.');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
const resetPassword = async (resetPasswordToken: string, newPassword: string): Promise<void> => {
  try {
    const resetPasswordTokenData = await tokenService.verifyToken(
      resetPasswordToken,
      TokenType.RESET_PASSWORD
    );
    const user = await userService.getUserById(resetPasswordTokenData.userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    const encryptedPassword = await encryptPassword(newPassword);
    await userService.updateUserById(user.id, { password: encryptedPassword });
    await Token.deleteMany({ userId: user._id, type: TokenType.RESET_PASSWORD }).exec();
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Admin change user password by user id
 * @param {string} userId
 * @param {string} password
 * @returns {Promise<User>}
 */
const adminChangeUserPassword = async (userId: string, password: string): Promise<IUser> => {
  const user = await userService.getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const updateData: { password: string } = {
    password: await encryptPassword(password)
  };

  const updatedUser = await User.findOneAndUpdate({ _id: userId }, updateData, {
    new: true,
    select: ['id', 'name', 'email', 'role']
  });

  return updatedUser as IUser;
};

/**
 * Change user password by user id
 * @param {string} userId
 * @param {string} oldPassword
 * @param {string} newPassword
 * @returns {Promise<User>}
 */
const userChangePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
): Promise<IUser> => {
  const user = await userService.getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const encryptedPassword = await encryptPassword(oldPassword);

  if (await isPasswordMatch(encryptedPassword, user.password as string)) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect credentials');
  }

  const updateData: { password: string } = {
    password: await encryptPassword(newPassword)
  };

  const updatedUser = await User.findOneAndUpdate({ _id: userId }, updateData, {
    new: true,
    select: ['id', 'name', 'email', 'role']
  });

  return updatedUser as IUser;
};

export default {
  loginUserWithEmailAndPassword,
  isPasswordMatch,
  encryptPassword,
  logout,
  refreshAuth,
  resetPassword,
  adminChangeUserPassword,
  userChangePassword
};
