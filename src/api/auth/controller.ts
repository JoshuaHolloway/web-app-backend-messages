import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import UsersModel from '../users/model';
import HttpError from '../../lib/http-error';
import env from '../../lib/config/env';

import { dateTimeIndicesOfToday } from '../../lib/helpers/date-index';
import { User } from '../../lib/types/User';

// ==============================================

const register = async (req: Request, res: Response, next: NextFunction) => {
  // Get todays date and time-index:
  const { date_index, time_index } = dateTimeIndicesOfToday();

  let user: User = { ...req.body, date_index, time_index };
  console.log('[POST] /api/auth/register, user: ', user);

  // bcrypting the password before saving
  const rounds = process.env.BCRYPT_ROUNDS || 8; // 2 ^ 8
  const hash = bcrypt.hashSync(user.password, rounds);

  // never save the plain text password in the db
  user.password = hash;

  try {
    const new_user = await UsersModel.insertUser(user);

    res.status(201).json({
      message: `Successful registration. Username: ${new_user.username}`,
    });
  } catch (err) {
    next(new HttpError('Error', 400));
  }
};

// ==============================================

const login = async (req: Request, res: Response, next: NextFunction) => {
  const username: string = req.body.username;
  const password: string = req.body.password;

  // console.log('[POST] /api/auth/login');

  try {
    const user_array = await UsersModel.getUserByUsername(username);

    const user = user_array[0];
    console.log('user: ', user);

    if (user && bcrypt.compareSync(password, user.password)) {
      const payload = {
        userId: user.user_id,
        username: user.username,
        role: user.role,
      };

      const options = {
        expiresIn: '1d', // '1d, 1h, 1m
      };

      const token_secret = env.TOKEN_SECRET;

      const token = jwt.sign(payload, token_secret, options);

      res.status(200).json({
        message: `Welcome back ${user.username}!`,
        token,
      });
    } else {
      next(new HttpError('Invalid Credentials', 401));
    }
  } catch (err) {}
};

// ==============================================

export default { register, login };
