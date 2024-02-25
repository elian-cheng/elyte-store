import passport from 'passport';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { NextFunction, Request, Response } from 'express';
import { IUser } from '../models/User';

// const verifyCallback =
//   (
//     req: Request,
//     resolve: (value?: unknown) => void,
//     reject: (reason?: unknown) => void,
//     requiredRoles: string[]
//   ) =>
//   async (err: unknown, user: User | false, info: unknown) => {
//     console.log('user1', user);

//     if (err || info || !user) {
//       return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate.'));
//     }

//     req.user = user;
//     console.log('user2', user);

//     if (requiredRoles.length) {
//       if (!requiredRoles.includes(user.role)) {
//         return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden action. Access denied.'));
//       }
//     }

//     resolve();
//   };

// const auth =
//   (...requiredRoles: string[]) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     return new Promise((resolve, reject) => {
//       passport.authenticate(
//         'jwt',
//         { session: false },
//         verifyCallback(req, resolve, reject, requiredRoles)
//       )(req, res, next);
//     })
//       .then(() => next())
//       .catch((err) => next(err));
//   };

const auth =
  (...requiredRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      'jwt',
      { session: false },
      (err: unknown, user: IUser | false, info: unknown) => {
        if (err || info || !user) {
          return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate.'));
        }
        req.user = user;

        if (requiredRoles.length && !requiredRoles.includes(user.role)) {
          return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden action. Access denied.'));
        }

        next();
      }
    )(req, res, next);
  };

export default auth;
