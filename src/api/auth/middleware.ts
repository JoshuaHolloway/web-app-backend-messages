import { Request, Response, NextFunction } from 'express';

// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken';

// const HttpError = require('../../lib/http-error');
import HttpError from '../../lib/http-error';

// ==============================================

const restricted = (req: Request, res: Response, next: NextFunction) => {
  // the server expects to find the token in the request header Authorization
  const token = req.headers.authorization; // req.headers.authorization is set even though Authorization:abcdef is sent as header when making request.

  if (token) {
    // async verify (with old-school node async callback style)
    // -callback is used to handle success or failure
    jwt.verify(
      token,
      process.env.TOKEN_SECRET!,
      (err: any, decoded_token: any) => {
        if (err) {
          // next({ status: 401, message: `token bad: ${err.message}` });
          next(new HttpError('Invalid JWT!', 401));
        } else {
          // -Token is valid => move along!
          res.locals.decoded_token = decoded_token;
          next();
        }
      }
    );
  } else {
    // next({ status: 401, message: 'Token required!' });
    next(new HttpError('JWT required!', 401));
  }
};

// ==============================================

const admin_only = (req: Request, res: Response, next: NextFunction) => {
  // console.log('req.decoded_token: ', req.decoded_token);
  if (res.locals.decoded_token.role === 'admin') {
    next();
  } else {
    next(new HttpError('Admin role required!', 401));
  }
};

// ==============================================

const checkAuthPayload = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  const valid = Boolean(username && password && typeof password === 'string');

  if (valid) {
    next();
  } else {
    next({
      status: 422,
      message:
        'Please provide username and password and the password shoud be alphanumeric',
    });
  }
};

// ==============================================

export default { checkAuthPayload, restricted, admin_only };
