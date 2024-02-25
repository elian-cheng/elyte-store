import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { authService, tokenService, emailService, userService } from '../services';
import { Role } from '../utils/constants';
import exclude from '../utils/exclude';

const register = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.createUser(email, password);
  const userWithoutPassword = exclude(user, ['password', 'createdAt', 'updatedAt']);
  const tokens = await tokenService.generateAuthTokens(user._id, user.role as Role);
  res.status(httpStatus.CREATED).send({ user: userWithoutPassword, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user._id, user.role as Role);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token as string, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const adminChangeUserPassword = catchAsync(async (req, res) => {
  await authService.adminChangeUserPassword(req.params.userId, req.body.password);
  res.status(httpStatus.NO_CONTENT).send({ message: 'Password updated successfully' });
});

const userChangePassword = catchAsync(async (req, res) => {
  await authService.userChangePassword(
    req.params.userId,
    req.body.oldPassword,
    req.body.newPassword
  );
  res.status(httpStatus.NO_CONTENT).send({ message: 'Password updated successfully' });
});

export default {
  login,
  logout,
  register,
  refreshTokens,
  forgotPassword,
  resetPassword,
  adminChangeUserPassword,
  userChangePassword
};
