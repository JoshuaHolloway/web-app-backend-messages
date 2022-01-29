import { orders_2_products } from '../construction/build-seeds';
// let orders_2_products: {
//   quantity: number;
//   product_id: number;
//   order_id: number;
// }[] = [];

exports.seed = function (knex: any, Promise: any) {
  // --------------------------------------------

  return knex('order_2_product').insert(orders_2_products);

  // --------------------------------------------
};
