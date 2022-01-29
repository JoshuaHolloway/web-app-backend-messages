import { Router, Request, Response, NextFunction } from 'express';
const router = Router();

// import { body, validationResult } from 'express-validator';
import usersController from './controller';
// import authMiddleware from '../auth/middleware';

// ==============================================

// [GET] /api/users
// router.get('/', authMiddleware.restricted, usersController.getUsers);
router.get('/', usersController.getAllUsers); // tests

// ==============================================

// [GET] /api/users/:user_id
router.get('/:user_id', usersController.getUserById);

// ==============================================

// [POST] /api/users/getUserByUsername
// -Used when registering to make sure username does not already exist in DB.
router.post('/getUserByUsername', usersController.getUserByUsername);

// ==============================================

// -Error handling middleware (user-router)
router.use(
  (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) /* eslint-disable-line */ => {
    console.log(
      '**********\nerror handling middleware (users-router)\n**********'
    );
    res.status(err.status || 500).json({
      stack: err.stack,
      customMessage: 'error-handling middleware in users-router',
      message: err.message,
    });
  }
);

// ==============================================

export default router;
