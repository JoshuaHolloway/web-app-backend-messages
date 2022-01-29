// const db = require('../../../db/db-config.js');
const db = require('../../../../db-config.js');

import ProductsModel from '../model';

// ==============================================

const fake_product_0 = { title: 'product-1', price: 1000 };
const fake_product_1 = { title: 'A', price: 300 };
const fake_product_2 = { title: 'B', price: 400 };

// ==============================================

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

// ==============================================

beforeEach(async () => {
  await db.seed.run();
});

// ==============================================

afterAll(async () => {
  await db.destroy();
});

// ==============================================

it('correct env var', () => {
  expect(process.env.NODE_ENV).toBe('testing');
});

// ==============================================

describe('Products model functions', () => {
  // --------------------------------------------

  describe('add products', () => {
    // - - - - - - - - - - - - - - - - - - - - -

    it('adds a product to DB', async () => {
      const product = await ProductsModel.addProduct(fake_product_1);
      // console.log('product: ', product);
      expect(product).toMatchObject(fake_product_1);

      const products = await ProductsModel.getAllProducts();
      // console.log('products: ', products);
      expect(products).toHaveLength(3);
    });

    // - - - - - - - - - - - - - - - - - - - - -
  });

  // --------------------------------------------
});

// ==============================================
