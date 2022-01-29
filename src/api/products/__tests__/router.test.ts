import request from 'supertest';

import server from '../../server';
// const db = require('../../../db/db-config.js');
const db = require('../../../../db-config.js');

// import ProductsModel from '../model';

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

describe('[GET] /api/products', () => {
  // --------------------------------------------
  it('should return a 200 OK status', async () => {
    const res = await request(server).get('/api/products');
    expect(res.status).toBe(200);
  });
  // --------------------------------------------
  it('should return JSON', async () => {
    const res = await request(server).get('/api/products');
    // console.log(res.header);
    expect(res.type).toBe('application/json');
  });
  // --------------------------------------------
  it('should return a list of products', async () => {
    const res = await request(server).get('/api/products');
    console.log(res.body);
    expect(res.body).toHaveLength(2);
  });
  // --------------------------------------------
});

// ==============================================

describe('[POST] /api/products', () => {
  // --------------------------------------------

  // it('should return a 422 if no name in payload', async () => {
  // const res = await request(server).post('/api/products').send({});
  // expect(res.status).toBe(422);
  // });

  // --------------------------------------------

  it('should return a 201 OK status', async () => {
    const res = await request(server)
      .post('/api/products')
      .send({ title: 'nike shirt', price: 1000 });
    expect(res.status).toBe(201);
  });

  // --------------------------------------------

  const timeout = 1000; // ms.
  it(
    'responds with the newly created user',
    async () => {
      const res = await request(server)
        .post('/api/products')
        .send({ title: 'nike socks', price: 1000 });
      console.log(res.body);
      expect(res.body).toMatchObject({ title: 'nike socks', price: 1000 });
    },
    timeout
  );

  // --------------------------------------------
});
