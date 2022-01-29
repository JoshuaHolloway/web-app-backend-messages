import { Request, Response, NextFunction, RequestHandler } from 'express';
import { v4 as uuid } from 'uuid';

import OrdersModel from './model';
import HttpError from '../../lib/http-error';

import { Order } from '../../lib/types/Order';
import { OrdersUsers } from '../../lib/types/OrdersUsers';

import {
  dateTimeIndicesOfToday,
  dateTime2Index,
} from '../../lib/helpers/date-index';

// ==============================================

// [GET]  /api/orders/:rows_per_page/:page/:status/:date_lo/:date_hi/:sort/:sort_type
// -Returns orders in a table created by joining the orders and the users
//  in order to display user information along with each order
//  (only user_id is stored in the orders table).
// -Paginated
const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  console.log('[GET] /api/orders');

  const rows_per_page = Number(req.params.rows_per_page);
  const page = Number(req.params.page);
  const status = Number(req.params.status);
  const date_lo = Number(req.params.date_lo);
  const date_hi = Number(req.params.date_hi);
  const sort_index = Number(req.params.sort);
  const sort_type: string = req.params.sort_type;

  try {
    const { rows, row_count }: { rows: OrdersUsers[]; row_count: number } =
      await OrdersModel.getOrders(
        rows_per_page,
        page,
        status,
        date_hi,
        date_lo,
        sort_index,
        sort_type
      );

    res.status(200).json({ rows, row_count });
  } catch (err: any) {
    next(new HttpError('The orders information could not be retrieved.', 500));
  }
};

// ==============================================

// [GET]  /api/orders/:id/products
//  -Get all products for a given order
//  -Used on Orders dropdown
//  -Joins tables Orders and Order2Product
const getProductsInOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id: number = Number(req.params.id);

  console.log(`[GET]  /api/orders/${id}/products`);

  try {
    const rows: {
      order_id: number;
      product_id: number;
      product_name: string;
      product_price: number;
      quantity: number;
    }[] = await OrdersModel.getProductsInOrderById(id);

    if (rows.length === 0) {
      next(
        new HttpError('The order with the specified ID does not exist.', 404)
      );
    } else {
      res.status(201).json(rows);
    }
  } catch (err) {
    next(new HttpError('The order information could not be retrieved.', 500));
  }
};

// ==============================================

// [GET]  /api/orders/:uuid
//  -Get order details.
//  -Returns data from fro tables:
//    --1. The row from the joind Orders and User table for the specific order.
//    --2. A series of rows from the Order_2_Product table joined with Products table (for product info)
const getOrderByUuid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uuid: string = req.params.uuid;

  console.log(`[GET]  /api/orders/${uuid}`);

  try {
    const order: {
      uuid: string;
      uuid_short: string;
      order_id: number;
      status: number;
      date: string; // for debugging
      date_index: number; // for filtering on date range
      // time_index: number;
      date_time_index: number;
      total: number;
      username: string;
      first_name: string;
      last_name: string;
    } = await OrdersModel.getOrderByUuid(uuid);

    const products: {
      order_id: number;
      product_id: number;
      product_name: string;
      product_price: number;
      quantity: number;
    }[] = await OrdersModel.getProductsInOrderById(order.order_id);

    res.status(200).json({ order, products });
  } catch (err: any) {
    next(new HttpError('The orders information could not be retrieved.', 500));
  }
};

// ==============================================

// [POST]  /api/orders
const postOrder = (req: Request, res: Response, next: NextFunction) => {
  console.log('[POST]  /api/orders');

  const user_id = res.locals.decoded_token.userId;

  const { cart, total } = req.body;

  // Get todays date and time-index:
  const { date_index, debugging_date_time } = dateTimeIndicesOfToday();
  const date_time_index = dateTime2Index();

  const _uuid_ = uuid();
  const uuid_short = _uuid_.split('-')[4];

  const order: Order = {
    user_id,
    uuid: _uuid_,
    uuid_short,
    date_time: debugging_date_time, // for debugging
    date_time_index,
    date_index, // for filtering on date-ranges
    status: 1, // 1 => sent to stripe page, 2 => stripe payment success, 3 => order complete, 0 => error
    total,
  };

  OrdersModel.insert({ ...order, cart })
    .then((order_id) => {
      console.log('Successful addition of order to DB! - order_id: ', order_id);
      res.status(201).json({ order_id });
    })
    .catch((err: any) => {
      // -There's an error while saving the _order_
      console.log('err: ', err);
      next(
        new HttpError(
          'There was an error while saving the order to the database',
          500
        )
      );
    });
};

// ==============================================

// [GET]  /api/orders/ordersForSpecificUser/:user_id
const getOrdersForSpecificUser = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const user_id: number = Number(req.params.user_id);
  console.log('[GET] /api/orders/ordersForSpecificUser/:user_id');
  console.log('res.locals.decoded_token: ', res.locals.decoded_token);

  // Authorization:
  // -Only allow users that are either admin
  //  or customers that are attempting to view
  //  only their own orders.

  if (
    res.locals.decoded_token.role === 'admin' ||
    (res.locals.decoded_token.role === 'customer' &&
      res.locals.decoded_token.userId === user_id)
  ) {
    try {
      const orders: Order[] = await OrdersModel.getOrdersForSpecificUser(
        user_id
      );
      res.status(200).json(orders);
    } catch (err: any) {
      next(
        new HttpError('The orders information could not be retrieved.', 500)
      );
    }
  } else {
    next(new HttpError('you do not have access to this users orders', 401)); // client request not completed due to lacking valid authentication credentials
  }
};

// ==============================================

// [PUT] /api/orders/:id
// const putOrderById: RequestHandler = async (req, res, next) => {
//   console.log('[PUT]  /api/orders/:id');

//   const id: string = req.params.id;

// };

// ==============================================

export default {
  getOrders,
  getOrderByUuid,
  getProductsInOrderById,
  postOrder,
  getOrdersForSpecificUser,
};
