import { v4 as uuid } from 'uuid';

import {
  date2Index,
  // time2Index,
  dateTime2Index,
} from '../../lib/helpers/date-index';
import { randomIntFromInterval } from '../../lib/helpers/rand';

import { order_status_map } from '../../lib/types/Order';
import type { Order } from '../../lib/types/Order';

// ==============================================

const today = new Date();
const yr = today.getFullYear();
const mo = today.getMonth();
const da = today.getDate();

const build_seeds = (
  num_products: number = 32,
  num_categories: number = 3,
  units_in_stock: number = 10,
  num_orders: number = 50,
  possible_products_per_order: number = 3, // number of products per order are between min and max here (inclusive)
  status_states: number = order_status_map.length,
  days: number[] = [1, da - 1], // -only generate the number of days in this given month
  months: number[] = [mo, mo], // dec-dec.
  years: number[] = [yr, yr]
) => {
  let products: {
    title: string;
    price: number;
    units_in_stock: number;
    category: number;
  }[] = [];
  for (let i = 0; i < num_products; ++i) {
    products.push({
      title: `product-${i + 1}`,
      price: randomIntFromInterval(1e2, 1e4),
      category: randomIntFromInterval(1, num_categories),
      units_in_stock: randomIntFromInterval(1, units_in_stock),
    });
  }

  // --------------------------------------------

  let orders: Order[] = [];

  let orders_2_products: {
    quantity: number;
    product_id: number;
    order_id: number;
  }[] = [];

  const daysInMonth = (y: number, m: number) =>
    [31, y % 4 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m];
  // jan feb                    mar apr may jun jul aug sep oct nov dec

  const today = new Date();

  for (let i = 1; i <= num_orders; ++i) {
    let order_total = 0;

    const year = randomIntFromInterval(years[0], years[1]);

    let month: number;
    if (today.getFullYear() === year) {
      month = randomIntFromInterval(
        months[0],
        Math.min(months[1], today.getMonth())
      );
    } else {
      month = randomIntFromInterval(months[0], months[1]);
    }

    let day: number;
    if (year === today.getFullYear() && month === today.getMonth()) {
      day = randomIntFromInterval(1, today.getDate());
    } else {
      day = randomIntFromInterval(
        days[0],
        Math.min(days[1], daysInMonth(year, month))
      );
    }

    // [09:00] (9am) - [16:59] (4:59pm)
    const hr = randomIntFromInterval(9, 16);
    const min = randomIntFromInterval(0, 59);
    // const time = `${hr}:${min}`;

    // -record the products in each order
    let product_ids: number[] = [];
    const num_products_in_order = randomIntFromInterval(1, 7);
    for (let j = 1; j <= num_products_in_order; ++j) {
      const product_id = randomIntFromInterval(1, num_products);

      const is_already_used = product_ids.find((elem) => elem === product_id);
      if (!is_already_used) {
        product_ids.push(product_id);

        const product_qty = randomIntFromInterval(
          1,
          possible_products_per_order
        );

        // console.log(
        //   'products[product_id]: ',
        //   products[product_id - 1], // using this element as n-1
        //   '\tproduct_id: ',
        //   product_id // we want this to be the actual 1-based index of the product_id
        // );

        order_total += product_qty * products[product_id - 1].price; // 1-based indexing in products db for id, yet products array is of course 0-based indexed

        orders_2_products.push({
          quantity: product_qty,
          product_id: product_id,
          order_id: i,
        });
      } // if (!is_already_used)
    } // for-j

    const _uuid_ = uuid();
    const uuid_short = _uuid_.split('-')[4];

    // -record the order
    orders.push({
      uuid: _uuid_,
      uuid_short,
      user_id: randomIntFromInterval(1, 2), // josh@josh.com
      total: order_total, // $1 to $100
      date_time: `${year}-${month}-${day} @ ${hr}:${min}`, // for debugging
      date_index: date2Index({ y: year, m: month, d: day }),
      // date_year: year,
      // date_month: month,
      // date_day: day,
      // time,
      // time_index: time2Index({ h: hr, m: min }),
      date_time_index: dateTime2Index(new Date(year, month, day, hr, min)),
      status: randomIntFromInterval(0, status_states - 1),
    });
  } // for-i

  // --------------------------------------------

  return {
    products,
    orders,
    orders_2_products,
  };
};

// ==============================================

const { products, orders, orders_2_products } = build_seeds(
  10, // num_products: number
  3, // num_categories: number = 3
  10, // units_in_stock: number = 10
  200, // 6.5e3, // num_orders: number
  3, // possible_products_per_order: number
  4, // status-states
  [1, 31], // [1, 25] //days: number[] = ,
  [0, 11], // months: number[] = [11, 11], // one-based
  [2021, 2022] // years: number[] = [2021, 2021]
);

// ==============================================

export { products, orders, orders_2_products };
