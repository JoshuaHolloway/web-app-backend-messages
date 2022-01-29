import { Request, Response, NextFunction } from 'express';

import usersModel from './model';
import HttpError from '../../lib/http-error';

import type { User } from '../../lib/types/User';

// ==============================================

// [GET] /api/users
const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  res.json(await usersModel.getAllUsers());
};

// ==============================================

// [GET] /api/users/:user_id
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const user_id: string = req.params.user_id;

  console.log('[GET] /api/users/:user_id -- user_id: ', user_id);

  try {
    const user: User[] = await usersModel.getUserById(user_id);
    if (user.length > 0) {
      res.status(200).json(user[0]);
    } else {
      next(new HttpError('user does not exist in database', 400));
    }
  } catch (err) {
    next(new HttpError('error looking up user by user_id', 400));
  }
};

// ==============================================

// [POST] /api/users/getUserByUsername
// -Used when registering to make sure username does not already exist in DB.
interface Req extends Request {
  body: { username: string };
}
const getUserByUsername = async (
  req: Req,
  res: Response,
  next: NextFunction
) => {
  console.log('req.body.username: ', req.body.username);

  try {
    const user: User[] = await usersModel.getUserByUsername(req.body.username);
    console.log('user: ', user);
    if (user.length > 0) {
      next(new HttpError('user already exists in database', 400));
    } else {
      res.status(200).json({ message: 'no user with supplied username in DB' });
    }
  } catch (err) {
    next(new HttpError('error looking up user by username', 400));
  }
};

// ==============================================

export default {
  getAllUsers,
  getUserById,
  getUserByUsername,
};
