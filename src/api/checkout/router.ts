import { Router, Request, Response, NextFunction } from 'express';
const router = Router();

import checkoutController from './controller';
import authMiddleware from '../auth/middleware';

// ==============================================

// [POST]  /api/checkout
router.post('/', authMiddleware.restricted, checkoutController.checkout);

// ==============================================

// [POST]  /api/checkout/success
router.post(
  '/success',
  authMiddleware.restricted,
  checkoutController.checkoutSuccess
);

// ==============================================

export default router;
