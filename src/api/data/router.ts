import { Router } from 'express';
const router = Router();

import dataController from './controller';
import authMiddleware from '../auth/middleware';

// ==============================================

// [POST] /api/data/distinct-product-ids-in-date-range
router.post(
  '/distinct-product-ids-in-date-range',
  authMiddleware.restricted,
  authMiddleware.admin_only,
  dataController.getDistinctProductsSoldInDateRange
);

// ==============================================

// [POST] /api/data/units-sold-of-specific-product-in-date-range/:product_id
router.post(
  '/get-units-sold-per-day-for-one-product-in-date-range/:product_id',
  authMiddleware.restricted,
  authMiddleware.admin_only,
  dataController.getUnitsSoldPerDayForOneProductInDateRange
);

// ==============================================

export default router;
