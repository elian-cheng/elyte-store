import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { userService } from '../services';
import exclude from '../utils/exclude';
import { IUser } from '../models/User';

const getUsers = catchAsync(async (req, res) => {
  const users = await userService.queryUsers();
  res.status(httpStatus.OK).send(users);
});

const getUser = catchAsync(async (req, res) => {
  const reqUser = req.user as IUser;

  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (reqUser && reqUser.role === 'user' && reqUser.id !== user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden action. Access denied.');
  }
  exclude(user, ['password']);
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const reqUser = req.user as IUser;

  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (reqUser && reqUser.role === 'user' && reqUser.id !== user.id) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden action. Access denied.');
  }

  const updatedUser = await userService.updateUserById(req.params.userId, req.body);
  res.send(updatedUser);
});

const updateUserRole = catchAsync(async (req, res) => {
  const updatedUser = await userService.updateUserRoleById(req.params.userId, req.body.role);
  res.send(updatedUser);
});

const deleteUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send({ message: 'User deleted' });
});

const banOrRestoreUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await userService.banOrRestoreUserById(user.id, user.isBanned);
  res.locals.errorMessage = 'User banned/restored successfully';
  res.status(httpStatus.NO_CONTENT).send({ message: 'User banned/restored successfully' });
});

export default {
  getUsers,
  getUser,
  updateUser,
  updateUserRole,
  deleteUser,
  banOrRestoreUser
};
