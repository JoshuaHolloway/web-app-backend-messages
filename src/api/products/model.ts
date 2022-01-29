const db = require('../../../db-config.js');

// ==============================================

interface Product {
  id: number;
  title: string;
  price: number;
  units_in_stock: number;
  category: number;
}

// ==============================================

const getAllProducts = () => db('products');

// ==============================================

const addProduct = async (new_product: { title: string; price: number }) => {
  // WITH POSTGRES WE CAN PASS A "RETURNING ARRAY" AS 2ND ARGUMENT TO knex.insert/update
  // AND OBTAIN WHATEVER COLUMNS WE NEED FROM THE NEWLY CREATED/UPDATED RECORD
  // UNLIKE SQLITE WHICH FORCES US DO DO A 2ND DB CALL
  const [new_db_product_obj] = await db('products').insert(new_product, [
    'id',
    'title',
    'price',
    'units_in_stock',
    'category',
  ]);
  // console.log('new_db_product_obj: ', new_db_product_obj);
  // for (let x in new_db_product_obj) {
  //   console.log('x: ', x, '\ttypeof x, ', typeof x);
  // }

  const product: Product = {
    title: new_db_product_obj.title,
    id: Number(new_db_product_obj.id), // comes in as string
    price: Number(new_db_product_obj.price), // comes in as string
    units_in_stock: Number(new_db_product_obj),
    category: Number(new_db_product_obj),
  };

  return product;
};

// ==============================================

const getProductById = async (id: string) => {
  const products = await db('products')
    .where({ id: Number(id) })
    .first();
  return products;
};

// ==============================================

async function update(id: string, product: Product) {
  const returned_id: string = await db('products')
    .where('id', Number(id))
    .update(product);
  return returned_id;
}

// ==============================================

async function remove(id: string) {
  console.log('remove');
  const to_be_deleted = await getProductById(id);
  console.log('products-model --> to_be_deleted: ', to_be_deleted);
  await db('products').where('id', Number(id)).del();
  return to_be_deleted;
}

// ==============================================

async function updateProductsSoldPerDay(product_id: number, quantity: number) {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const dt = `${year}-${month}-${day}`;
  console.log('dt: ', dt);

  // const x = await db.raw(`
  //   UPDATE products_sold_per_day
  //   SET
  //     qty_sold = qty_sold + ${quantity}
  //   WHERE
  //     date = '${year}-${month}-${day}' AND product_id = ${product_id};
  // `);
  // console.log('x._eventsCount: ', x._eventsCount);

  const x = await db('products_sold_per_day')
    .where({ product_id, date: dt })
    .increment('qty_sold', quantity);

  console.log('x: ', x);

  // await db('products_sold_per_day').where({ product_id, date }).update({qty_sold: qty_sold + });
}

// ==============================================

export default {
  getAllProducts,
  addProduct,
  getProductById,
  update,
  remove,
  updateProductsSoldPerDay,
};
