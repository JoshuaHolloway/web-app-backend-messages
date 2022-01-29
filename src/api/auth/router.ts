import { Router, Request, Response, NextFunction } from 'express';
const router = Router();

// ==============================================

import authController from './controller';

// ==============================================

// [POST] /api/auth/register
router.post(
  '/register',
  // authMiddleware.checkAuthPayload,
  authController.register
);

// ==============================================

// [POST] /api/auth/login
router.post(
  '/login',
  //authMiddleware.checkAuthPayload,
  authController.login
);

// ==============================================

export default router;
