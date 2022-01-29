const db = require('../../../db-config');

import { DateRangeTuple } from '../../lib/helpers/date-index';

// ==============================================

async function getDistinctProductsSoldInDateRange(date_range: DateRangeTuple) {
  // Used by:
  //  -/api/data/controller - getDistinctProductsSoldInDateRange()

  console.log('(model) date_range: ', date_range);

  const { rows } = await db.raw(`
    select DISTINCT product_id from order_2_product
    JOIN orders ON orders.id = order_2_product.order_id
    where ${date_range[0]} <= date_index AND date_index <= ${date_range[1]};
  `);

  return rows;
}

// ==============================================

async function getUnitsSoldPerDayForOneProductInDateRange(
  date_range: DateRangeTuple,
  product_id: string
) {
  // Used by:
  //  -/api/data/controller - getUnitsSoldPerDayForOneProductInDateRange()

  console.log('(model) date_range: ', date_range);

  const { rows } = await db.raw(`
    SELECT date_index, order_2_product.product_id, CAST(SUM(quantity)AS INT) units_sold
    from order_2_product 
    JOIN orders ON orders.id = order_2_product.order_id
    where ${date_range[0]} <= date_index AND date_index <= ${date_range[1]} AND product_id = ${product_id}
    GROUP BY date_index, order_2_product.product_id
    ORDER BY date_index ASC;
  `);

  return rows;
}

// ==============================================

// module.exports = {
//   getOrders,
//   findById,
//   getUsersOrders,
//   insert,
// };
export default {
  getDistinctProductsSoldInDateRange,
  getUnitsSoldPerDayForOneProductInDateRange,
};
