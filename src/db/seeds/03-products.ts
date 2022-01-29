import { products, orders } from '../construction/build-seeds';
// let products: { title: string; price: number }[] = [];

// ==============================================

exports.seed = function (knex: any, Promise: any) {
  // --------------------------------------------

  return knex('products').insert(products);

  // --------------------------------------------
};

// ==============================================
