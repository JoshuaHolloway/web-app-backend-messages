import { orders } from '../construction/build-seeds';
// let orders: {
//   total: number;
//   date: string;
//   user_id: number;
// }[] = [];

exports.seed = function (knex: any, Promise: any) {
  // --------------------------------------------

  return knex('orders').insert(orders);

  // --------------------------------------------
};
