import request from 'supertest';
import httpStatus from 'http-status';
import moment from 'moment';
import app from '../../src/app';
import config from '../../src/config/config';
import { emailService, tokenService } from '../../src/services';
import setupTestDB from '../utils/setupTestDb';
import { describe, beforeEach, test, expect, jest } from '@jest/globals';
import { userOne, insertUsers } from '../fixtures/user.fixture';
import User, { IUser } from '../../src/models/User';
import { Role, TokenType } from '../../src/utils/constants';
import Token from '../../src/models/Token';

setupTestDB();

describe('Auth routes', () => {
  describe('POST /auth/login', () => {
    test('should return 200 and login user if email and password match', async () => {
      await insertUsers([userOne]);
      const loginCredentials = {
        email: userOne.email,
        password: userOne.password
      };

      const res = await request(app)
        .post('/auth/login')
        .send(loginCredentials)
        .expect(httpStatus.OK);

      expect(res.body.user).toMatchObject({
        _id: expect.anything(),
        name: userOne.name,
        email: userOne.email,
        role: userOne.role,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        isBanned: false
      });

      // expect(res.body.user).toEqual(expect.not.objectContaining({ password: expect.anything() }));

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() }
      });
    });

    test('should return 401 error if there are no users with that email', async () => {
      const loginCredentials = {
        email: userOne.email,
        password: userOne.password
      };

      const res = await request(app)
        .post('/auth/login')
        .send(loginCredentials)
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body).toEqual({
        code: httpStatus.UNAUTHORIZED,
        message: 'Incorrect credentials'
      });
    });

    test('should return 401 error if password is wrong', async () => {
      await insertUsers([userOne]);
      const loginCredentials = {
        email: userOne.email,
        password: 'wrongPassword1'
      };

      const res = await request(app)
        .post('/auth/login')
        .send(loginCredentials)
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body).toEqual({
        code: httpStatus.UNAUTHORIZED,
        message: 'Incorrect credentials'
      });
    });
  });

  describe('POST /auth/logout', () => {
    test('should return 204 if refresh token is valid', async () => {
      await insertUsers([userOne]);
      const dbUserOne = (await User.findOne({ email: userOne.email })) as IUser;
      const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
      const refreshToken = tokenService.generateToken(
        dbUserOne._id,
        Role.USER,
        expires,
        TokenType.REFRESH
      );
      await tokenService.saveToken(
        refreshToken,
        dbUserOne._id,
        Role.USER,
        expires,
        TokenType.REFRESH
      );

      await request(app).post('/auth/logout').send({ refreshToken }).expect(httpStatus.NO_CONTENT);

      const dbRefreshTokenData = await Token.findOne({ token: refreshToken });
      expect(dbRefreshTokenData).toBe(null);
    });

    test('should return 400 error if refresh token is missing from request body', async () => {
      await request(app).post('/auth/logout').send().expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 error if refresh token is not found in the database', async () => {
      await insertUsers([userOne]);
      const dbUserOne = (await User.findOne({ email: userOne.email })) as IUser;
      const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
      const refreshToken = tokenService.generateToken(
        dbUserOne._id,
        Role.USER,
        expires,
        TokenType.REFRESH
      );

      await request(app).post('/auth/logout').send({ refreshToken }).expect(httpStatus.NOT_FOUND);
    });

    test('should return 404 error if refresh token is blacklisted', async () => {
      await insertUsers([userOne]);
      const dbUserOne = (await User.findOne({ email: userOne.email })) as IUser;
      const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
      const refreshToken = tokenService.generateToken(
        dbUserOne._id,
        Role.USER,
        expires,
        TokenType.REFRESH
      );
      await tokenService.saveToken(
        refreshToken,
        dbUserOne._id,
        Role.USER,
        expires,
        TokenType.REFRESH,
        true
      );

      await request(app).post('/auth/logout').send({ refreshToken }).expect(httpStatus.NOT_FOUND);
    });
  });

  describe('POST /auth/refresh-tokens', () => {
    test('should return 200 and new auth tokens if refresh token is valid', async () => {
      await insertUsers([userOne]);
      const dbUserOne = (await User.findOne({ email: userOne.email })) as IUser;
      const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
      const refreshToken = tokenService.generateToken(
        dbUserOne._id,
        Role.USER,
        expires,
        TokenType.REFRESH
      );
      await tokenService.saveToken(
        refreshToken,
        dbUserOne._id,
        Role.USER,
        expires,
        TokenType.REFRESH
      );

      const res = await request(app)
        .post('/auth/refresh-tokens')
        .send({ refreshToken })
        .expect(httpStatus.OK);

      expect(res.body).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() }
      });

      const dbRefreshTokenData = await Token.findOne({ token: res.body.refresh.token })
        .select('type userId isBlacklisted')
        .exec();
      expect(dbRefreshTokenData).toMatchObject({
        type: TokenType.REFRESH,
        userId: dbUserOne._id,
        isBlacklisted: false
      });

      const dbRefreshTokenCount = await Token.countDocuments();
      expect(dbRefreshTokenCount).toBe(1);
    });

    test('should return 400 error if refresh token is missing from request body', async () => {
      await request(app).post('/auth/refresh-tokens').send().expect(httpStatus.BAD_REQUEST);
    });

    test('should return 401 error if refresh token is signed using an invalid secret', async () => {
      await insertUsers([userOne]);
      const dbUserOne = (await User.findOne({ email: userOne.email })) as IUser;
      const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
      const refreshToken = tokenService.generateToken(
        dbUserOne._id,
        Role.USER,
        expires,
        TokenType.REFRESH,
        'invalidSecret'
      );
      await tokenService.saveToken(
        refreshToken,
        dbUserOne._id,
        Role.USER,
        expires,
        TokenType.REFRESH
      );

      await request(app)
        .post('/auth/refresh-tokens')
        .send({ refreshToken })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 error if refresh token is not found in the database', async () => {
      await insertUsers([userOne]);
      const dbUserOne = (await User.findOne({ email: userOne.email })) as IUser;
      const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
      const refreshToken = tokenService.generateToken(
        dbUserOne._id,
        Role.USER,
        expires,
        TokenType.REFRESH
      );

      await request(app)
        .post('/auth/refresh-tokens')
        .send({ refreshToken })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 error if refresh token is blacklisted', async () => {
      await insertUsers([userOne]);
      const dbUserOne = (await User.findOne({ email: userOne.email })) as IUser;
      const expires = moment().add(config.jwt.refreshExpirationDays, 'days');
      const refreshToken = tokenService.generateToken(
        dbUserOne._id,
        Role.USER,
        expires,
        TokenType.REFRESH
      );
      await tokenService.saveToken(
        refreshToken,
        dbUserOne._id,
        Role.USER,
        expires,
        TokenType.REFRESH,
        true
      );

      await request(app)
        .post('/auth/refresh-tokens')
        .send({ refreshToken })
        .expect(httpStatus.UNAUTHORIZED);
    });

    test('should return 401 error if refresh token is expired', async () => {
      await insertUsers([userOne]);
      const dbUserOne = (await User.findOne({ email: userOne.email })) as IUser;
      const expires = moment().subtract(1, 'minutes');
      const refreshToken = tokenService.generateToken(
        dbUserOne._id,
        Role.USER,
        expires,
        TokenType.REFRESH
      );
      await tokenService.saveToken(
        refreshToken,
        dbUserOne._id,
        Role.USER,
        expires,
        TokenType.REFRESH
      );

      await request(app)
        .post('/auth/refresh-tokens')
        .send({ refreshToken })
        .expect(httpStatus.UNAUTHORIZED);
    });
  });

  describe('POST /auth/forgot-password', () => {
    beforeEach(() => {
      jest.spyOn(emailService.transport, 'sendMail').mockClear();
    });

    test('should return 204 and send reset password email to the user', async () => {
      await insertUsers([userOne]);
      const dbUserOne = (await User.findOne({ email: userOne.email })) as IUser;
      const sendResetPasswordEmailSpy = jest
        .spyOn(emailService, 'sendResetPasswordEmail')
        .mockImplementationOnce(() => new Promise((resolve) => void resolve()));

      await request(app)
        .post('/auth/forgot-password')
        .send({ email: userOne.email })
        .expect(httpStatus.NO_CONTENT);

      expect(sendResetPasswordEmailSpy).toHaveBeenCalledWith(userOne.email, expect.any(String));
      const resetPasswordToken = sendResetPasswordEmailSpy.mock.calls[0][1];
      const dbResetPasswordTokenData = await Token.findOne({
        token: resetPasswordToken,
        userId: dbUserOne._id
      }).exec();
      expect(dbResetPasswordTokenData).toBeDefined();
    });

    test('should return 400 if email is missing', async () => {
      await insertUsers([userOne]);

      await request(app).post('/auth/forgot-password').send().expect(httpStatus.BAD_REQUEST);
    });

    test('should return 404 if email does not belong to any user', async () => {
      await request(app)
        .post('/auth/forgot-password')
        .send({ email: userOne.email })
        .expect(httpStatus.NOT_FOUND);
    });
  });

  describe('POST /auth/reset-password', () => {
    test('should return 400 if reset password token is missing', async () => {
      await insertUsers([userOne]);

      await request(app)
        .post('/auth/reset-password')
        .send({ password: 'password2' })
        .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 if password is missing or invalid', async () => {
      await insertUsers([userOne]);
      const dbUserOne = (await User.findOne({ email: userOne.email })) as IUser;
      const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
      const resetPasswordToken = tokenService.generateToken(
        dbUserOne._id,
        Role.USER,
        expires,
        TokenType.RESET_PASSWORD
      );
      await tokenService.saveToken(
        resetPasswordToken,
        dbUserOne._id,
        Role.USER,
        expires,
        TokenType.RESET_PASSWORD
      );

      await request(app)
        .post('/auth/reset-password')
        .query({ token: resetPasswordToken })
        .expect(httpStatus.BAD_REQUEST);

      await request(app)
        .post('/auth/reset-password')
        .query({ token: resetPasswordToken })
        .send({ password: 'short1' })
        .expect(httpStatus.BAD_REQUEST);

      await request(app)
        .post('/auth/reset-password')
        .query({ token: resetPasswordToken })
        .send({ password: 'password' })
        .expect(httpStatus.BAD_REQUEST);

      await request(app)
        .post('/auth/reset-password')
        .query({ token: resetPasswordToken })
        .send({ password: '11111111' })
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});
