const db = require('../../../db-config');

import { Order } from '../../lib/types/Order';
import { CartItem } from '../../lib/types/CartItem';
// import { OrdersUsers } from '../../lib/types/OrdersUsers';

import { joinTablesOrders } from '../../lib/helpers/join-tables';

// ==============================================

async function getAllOrders() {
  return db('orders');
}

// ==============================================

async function getOrdersOnSpecificDate(date: string) {
  // date format: '2021-12-20'

  const { rows: orders_on_specific_date } = await db.raw(
    `SELECT * FROM orders WHERE created_at BETWEEN '${date}T00:00:00.000Z' AND '${date}T23:59:59.999Z';`
  );
  return orders_on_specific_date;
}

// ==============================================

async function getOrdersForSpecificUser(user_id: number) {
  const { rows: orders } = await db.raw(
    `select * from orders where user_id = ${user_id};`
  );
  return orders;
}

// ==============================================

// -return a modified row from joining the orders table with the orders_2_products table
const getProductsInOrderById = async (order_id: number) => {
  // return db('orders')
  //   .where({ id: Number(id) })
  //   .first();

  console.log('(model) getProductsInOrderById( order_id ) ');

  const { rows } = await db.raw(`
    select 
      order_2_product.order_id,
      order_2_product.product_id,
      products.title as product_name,
      products.price as product_price,
      products.category,
      order_2_product.quantity
    from products
    join order_2_product on products.id = order_2_product.product_id
    where order_2_product.order_id = ${order_id};
  `);

  console.log('(model) getProductsInOrderById( order_id ), rows:  ', rows);

  return rows;
};
// ==============================================

interface OrderWithCart extends Order {
  cart: CartItem[];
}
async function insert(order_with_cart: OrderWithCart) {
  // WITH POSTGRES WE CAN PASS A "RETURNING ARRAY" AS 2ND ARGUMENT TO knex.insert/update
  // AND OBTAIN WHATEVER COLUMNS WE NEED FROM THE NEWLY CREATED/UPDATED RECORD
  // UNLIKE SQLITE WHICH FORCES US DO DO A 2ND DB CALL

  console.log('insert - order_with_cart: ', order_with_cart);

  const {
    user_id,
    uuid,
    uuid_short,
    date_time, // for debugging
    date_time_index,
    date_index, // for filtering on date-ranges
    status,
    total,
    cart,
  } = order_with_cart;

  // -Step 1: Add new entry into Orders table (user-id FK)
  const [new_order_obj] = await db('orders').insert(
    {
      user_id,
      uuid,
      uuid_short,
      date_time, // for debugging
      date_time_index,
      date_index, // for filtering on date-ranges
      status,
      total,
      // cart,
    },
    [
      'id',
      'user_id',
      'uuid_short',
      'date_time', // for debugging
      'date_time_index',
      'date_index', // for filtering on date-ranges
      'status',
      'total',
      // 'cart',
    ]
  );

  const order_id = new_order_obj.id;

  // -Step 2: Place cart items in order_2_product table
  for (let i = 0; i < cart.length; ++i) {
    await db('order_2_product').insert(
      { order_id, product_id: cart[i].product_id, quantity: cart[i].quantity },
      ['id', 'order_id', 'product_id', 'quantity']
    );
  }
  // -Setp 3: Join the two tables and return the data for this new order
  // const new_order_data_joined = await findById(order_id);

  // -Step 4: The tables have the following structure:
  //  orders:           id    total     user_id     created_at    updated_at
  //  products:         id    title     price
  //  order_2_product:  id    quantity  product_id  order_id
  //
  //  joined table from step 3:
  //                    order_id        product_name        product_price

  // -When we use this data on the frontend, we want to display it as a nested table:
  //  --Each row:           A row from the orders table
  //    --For each row:     A nested table containing the products from that given order

  // -This 'insert()' model function is executed when a user places an order
  //  (well, when the click the 'place-order' button and are sent to the stripe checkout page)
  //  (after successfully entering credit card info and getting success redirect from stripe
  //   I will then change the created table entry from this 'insert()' function from a status of pending to order placed)
  // -We don't need to return anything from this function.
  // -We only want to look into the orders table for two scenarios:
  //    --1. The admin wants to see all orders (or the details for a specific order) corresponding to a given user
  //    --2. The user wants to see all orders  (or the details for a specific order).

  // -When either of these two scenarios occur, we want to display the nested table described above.
  //  --The row simply needs to do a query into the orders-table.
  //  --Each nested table needs to do a join to return all the products for a given order.

  return order_id;
}

// ==============================================

const getOrders = async (
  rows_per_page: number,
  page: number,
  status: number,
  date_hi: number,
  date_lo: number,
  sort_index: number,
  sort_type: string
) => {
  // NOTE: table2 MUST have an id primary-key for the first general SQL query!

  console.log(
    '(model) getOrders -- date_lo: ',
    date_lo,
    '\tdate_hi: ',
    date_hi
  );

  const table1 = 'users';
  const table2 = 'orders';

  const cols1 = ['user_id' /* (pk) */, 'username', 'first_name', 'last_name'];
  const cols2 = [
    'id as order_id' /* (pk) */,
    'uuid',
    'uuid_short',
    'status',
    'date_time', // for-debugging
    'date_time_index',
    'date_index', // for filtering on date-ranges
    'total',
  ];

  const sort_map = [
    'date_time_index',
    'last_name',
    'first_name',
    'username',
    'total',
  ];

  const { rows, row_count } = await joinTablesOrders({
    db,
    table1,
    table2,
    cols1,
    cols2,
    date_lo,
    date_hi,
    page,
    rows_per_page,
    num_status_options: 5, // error, tentative, pending, complete, all
    status,
    sort_index,
    sort_type,
    sort_map,
  });

  return { rows, row_count };
};

// ==============================================

const getOrderByUuid = async (uuid: string) => {
  console.log('(model) getOrderByUuid - uuid: ', uuid);

  const rows = await db('users as u')
    .join('orders as o', 'u.user_id', 'o.user_id')
    .select(
      'o.uuid',
      'o.uuid_short',
      'o.id as order_id',
      'u.user_id',
      'o.status',
      'o.date_time', // for-debugging
      'o.date_time_index',
      'o.date_index', // for filtering on date-ranges
      'o.total',
      'u.username',
      'u.first_name',
      'u.last_name'
      // 'u.user_id'
    )
    // .orderBy('date_time_index', 'desc')
    // .limit(rows_per_page)
    // .offset(rows_per_page * page);
    .where('o.uuid', uuid);

  console.log('(model) getOrderByUuid, rows: ', rows);

  // -Grab first element from array.
  // -Should be a one element array of objects where each row is an element of the array.
  // -There should only be one row for this uuid.
  return rows[0];
};

// ==============================================

async function updateStatus(id: string, status: number) {
  const { rows: orders } = await db.raw(
    `UPDATE orders
      SET
        status = '${status}'
      WHERE
        id = ${id};`
  );
  console.log('orders: ', orders);

  // return order;
}

// ==============================================

export default {
  getAllOrders,
  getOrdersOnSpecificDate,
  getOrdersForSpecificUser,
  getOrderByUuid,
  getProductsInOrderById,
  getOrders,
  insert,
  updateStatus,
};
