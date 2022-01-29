import { Router, Request, Response, NextFunction } from 'express';
const router = Router();

import ordersController from './controller';
import authMiddleware from '../auth/middleware';

// ==============================================

// (6-params)
// [GET]  /api/orders/:rows_per_page/:page/:status/:date_lo/:date_hi/:sort/:sort_type
//  -Orders table - with pagination (frontend /admin/orders)
router.get(
  '/:rows_per_page/:page/:status/:date_lo/:date_hi/:sort/:sort_type', // two values encoded in param in order to not have number of params clash with ones for the endpoing for /api/orders/:order_id/products (dropdon for order-row on orders table that gets all products per order)
  authMiddleware.restricted,
  authMiddleware.admin_only,
  ordersController.getOrders
);

// ==============================================

// (2-'params')
// [GET]  /api/orders/:uuid/products
//  -Order table dropdown for products in order  (frontend /admin/orders)
router.get(
  '/:id/products',
  authMiddleware.restricted,
  authMiddleware.admin_only,
  ordersController.getProductsInOrderById
);

// ==============================================

// (1-param)
// [GET]  /api/orders/:uuid
//  -Order details page (frontend: /admin/orders/[uuid])
router.get(
  '/:uuid',
  authMiddleware.restricted,
  authMiddleware.admin_only,
  ordersController.getOrderByUuid
);

// ==============================================

// TODO:
// TODO:
// TODO:
// TODO:
// TODO:
// TODO:
// TODO:
// Endpoint for logged in user to access their own orders
// -authorization : User can only access THEIR OWN orders
// -NEW MIDDLEWARE:
//  --authMiddleware.admin_or_authorized_customer()

// ==============================================

// [POST]  /api/orders   (this is where we go when a customer places an order)
router.post('/', authMiddleware.restricted, ordersController.postOrder);

// ==============================================

// [GET]  /api/orders/ordersForSpecificUser/:user_id
router.get(
  ///ordersForSpecificUser
  '/ordersForSpecificUser/:user_id',
  authMiddleware.restricted,
  ordersController.getOrdersForSpecificUser
);

// ==============================================

// -Error handling middleware (orders-router)
router.use(
  (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) /* eslint-disable-line */ => {
    console.log(
      `
      ******************************************************
      *****Error-Handling Middleware (orders-router)******
      ******************************************************
    `
    );

    // --------------------------------------------

    // -Check if response has already been sent.
    // -If so, then forward the error.
    if (res.headersSent) {
      return next({ message: err.message });
    }

    // --------------------------------------------
    // err.code
    res.status(err.status || 500).json({
      stack: err.stack,
      message: err.message || 'an unkown error occurred (order-router.js)',
    });
  }
);

// ==============================================

// module.exports = router;
export default router;
