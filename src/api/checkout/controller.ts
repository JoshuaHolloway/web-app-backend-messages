import { Request, Response, NextFunction } from 'express';

import { Stripe, stripe, cart2line_items } from './helper';
import HttpError from '../../lib/http-error';
import OrdersModel from '../orders/model';
import ProductsModel from '../products/model';

// ==============================================

// [POST]  /api/checkout
const checkout = async (req: Request, res: Response, next: NextFunction) => {
  // -Forward this to the success page to be able to update the status
  const order_id = req.body.order_id;

  const cart_items = req.body.cart_items;
  console.log('[POST] /api/checkout - cart_items: ', cart_items);
  const line_items = await cart2line_items(cart_items);

  const href = req.body.href;

  try {
    // https://vercel.com/guides/getting-started-with-nextjs-typescript-stripe#step-2:-creating-a-checkoutsession-and-redirecting-to-stripe-checkout
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      // success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
      success_url: `${req.headers.origin}/checkout/success?order_id=${order_id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${href}`,
    };
    const checkoutSession: Stripe.Checkout.Session =
      await stripe.checkout.sessions.create(params);
    res.json({ url: checkoutSession.url });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
};

// ==============================================

// [POST]  /api/checkout/success
const checkoutSuccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session_id = req.body.session_id;
  const order_id = req.body.order_id;
  const cart = req.body.cart;

  console.log('session_id: ', session_id);
  console.log('order_id: ', order_id);
  console.log('cart: ', cart);

  // -In future access the customer via the session_id
  // -For now we do 2 things:
  //  --1. Update the status of the order in the orders table.
  //  --2. Update the number of products sold today

  try {
    // const session: any = await stripe.checkout.sessions.retrieve(session_id);
    // console.log('session: ', session);
    // res.json({ session });
    // const customer = await stripe.customers.retrieve(session.customer);
    // console.log('customer: ', customer);

    // Update Order Status
    await OrdersModel.updateStatus(order_id, 2);

    // res.json({ name: customer.name });
    // OrdersModel.updateStatus()
  } catch (err: any) {
    next(new HttpError('Error accessing stripe customer', 400));
  }
};

// ==============================================

export default { checkout, checkoutSuccess };
