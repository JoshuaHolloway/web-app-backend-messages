import productsModel from '../products/model';
import type { CartItem } from '../../lib/types/CartItem';

// https://github.com/stripe/stripe-node#usage-with-typescript
import Stripe from 'stripe';
const sk_test =
  typeof process.env.STRIPE_PRIVATE_KEY === 'string'
    ? process.env.STRIPE_PRIVATE_KEY
    : '';
const stripe = new Stripe(sk_test, {
  apiVersion: '2020-08-27',
});

// ==============================================

const cart2line_items = async (cart_items: CartItem[]) => {
  console.log('cart_items: ', cart_items);

  // node_modules\stripe\types\2020-08-27\Checkout\Sessions.d.ts
  // -> namespace Stripe -> namespace Checkout -> namespace SessionCreateParams -> interface LineItem
  // let line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let line_items: Array<Stripe.Checkout.SessionCreateParams.LineItem> = [];

  for (let i = 0; i < cart_items.length; ++i) {
    const product = await productsModel.getProductById(
      String(cart_items[i].product_id)
    );
    line_items.push({
      // name: The name for the item to be displayed on the Checkout page.
      name: product.title,
      // amount: The amount to be collected per unit of the line item. If specified, must also pass `currency` and `name`.
      amount: product.price,
      // currency: Three-letter [ISO currency code](https://www.iso.org/iso-4217-currency-codes.html), in lowercase. Must be a [supported currency](https://stripe.com/docs/currencies). Required if `amount` is passed.
      currency: 'usd',
      // quantity: The quantity of the line item being purchased.
      quantity: cart_items[i].quantity,
    });
  }

  return line_items;
};

// ==============================================

export { Stripe, stripe, cart2line_items };
