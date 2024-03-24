import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { encryptPassword } from '../utils/encryption';
import User, { IUser } from '../models/User';
import { Role } from '../utils/constants';

export const queryUsersSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  isBanned: true,
  createdAt: true,
  updatedAt: true
};

/**
 * Create a user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUser>}
 */
const createUser = async (email: string, password: string): Promise<IUser> => {
  if (await getUserByEmail(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return await User.create({
    email,
    password: await encryptPassword(password),
    role: Role.USER
  });
};

/**
 * Query for users
 * @returns {Promise<IUser[]>}
 */
const queryUsers = async () => {
  return await User.find().select(queryUsersSelect).sort({ _id: 'asc' });
};

/**
 * Get user by id
 * @param {string} id
 * @returns {Promise<IUser>}
 */
const getUserById = async (id: string): Promise<IUser | null> => {
  return await User.findOne({ _id: id });
};

/**
 * Get user by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<IUser, Key> | null>}
 */
const getUserByEmail = async <Key extends keyof IUser>(
  email: string,
  keys: Key[] = [
    'id',
    'email',
    'name',
    'phone',
    'password',
    'role',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<IUser, Key> | null> => {
  // select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  return await User.findOne({ email }).select(keys.join(' ')).exec();
};

/**
 * Update user by id
 * @param {string} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async <Key extends keyof IUser>(
  userId: string,
  updateBody: Partial<IUser>,
  keys: Key[] = ['id', 'name', 'email'] as Key[]
): Promise<Pick<IUser, Key> | null> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (updateBody.email !== user.email && (await getUserByEmail(updateBody.email as string))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const updatedUser = await User.findOneAndUpdate({ _id: userId }, updateBody, {
    new: true,
    select: keys.join(' ')
  });

  return updatedUser as Pick<IUser, Key> | null;
};

/**
 * Update user role by id
 * @param {string} userId
 * @param {string} role
 * @returns {Promise<IUser>}
 */
const updateUserRoleById = async (userId: string, role: Role): Promise<IUser> => {
  const user = await getUserById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const updateData: { role: Role } = {
    role: role
  };

  const updatedUser = await User.findOneAndUpdate({ _id: userId }, updateData, {
    new: true,
    select: queryUsersSelect
  });

  return updatedUser as IUser;
};

/**
 * Delete user by id
 * @param {number} userId
 * @returns {Promise<IUser>}
 */
const deleteUserById = async (userId: number): Promise<IUser> => {
  return (await User.findOneAndDelete({ _id: userId })) as IUser;
};

/**
 * Ban/restore user by id
 * @param {number} userId
 * @param {boolean} isBanned
 * @returns {Promise<User>}
 */
const banOrRestoreUserById = async (userId: number, isBanned: boolean) => {
  const user = await User.findOneAndUpdate(
    { _id: userId },
    {
      isBanned: !isBanned
    },
    {
      new: true,
      select: queryUsersSelect
    }
  );

  // const user = await User.findById(userId);

  // if (!user) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  // }

  // user.isBanned = !isBanned;
  // await user.save();

  return user;
};

export default {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  updateUserRoleById,
  deleteUserById,
  banOrRestoreUserById
};
