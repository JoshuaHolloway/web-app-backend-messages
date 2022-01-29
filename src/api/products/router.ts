import { Router, Request, Response, NextFunction } from 'express';
const router = Router();

import { body, validationResult } from 'express-validator';

import productsController from './controller';
import authMiddleware from '../auth/middleware';

// ==============================================

// [GET] /api/products
router.get('/', productsController.getProducts);

// ==============================================

// [GET] /api/products/:id
router.get('/:id', productsController.getProductById);

// ==============================================

// [POST] /api/products
router.post(
  '/',
  authMiddleware.restricted,
  authMiddleware.admin_only,
  body('title').isLength({ min: 1 }),
  productsController.postProduct
);

// ==============================================

// [PUT] /api/products/:id
router.put(
  '/:id',
  authMiddleware.restricted,
  authMiddleware.admin_only,
  productsController.putProductById
);

// ==============================================

// [DELETE] /api/products
router.delete(
  '/:id',
  authMiddleware.restricted,
  authMiddleware.admin_only,
  productsController.deleteProductById
);

// ==============================================

export default router;
