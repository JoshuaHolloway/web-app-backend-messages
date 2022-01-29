// import { table } from 'console';

exports.up = async (knex: any) => {
  await knex.schema
    .createTable('users', (tbl: any) => {
      tbl.increments('user_id');
      tbl.string('username', 200).notNullable().unique();
      tbl.string('password', 200).notNullable();
      tbl.string('first_name', 200);
      tbl.string('last_name', 200);
      tbl.string('role', 200).notNullable();
      tbl.integer('date_index').notNullable();
      tbl.integer('time_index').notNullable();
      tbl.timestamps(false, true);
    })
    .createTable('products', (tbl: any) => {
      tbl.increments('id');
      tbl.string('title', 50).notNullable(); //.unique();
      // tbl.string('details', 256);
      tbl.integer('price').unsigned();
      tbl.integer('category').unsigned;
      tbl.integer('units_in_stock').unsigned();
    })
    .createTable('orders', (tbl: any) => {
      tbl.increments('id');
      tbl.string('uuid');
      tbl.string('uuid_short');
      tbl.integer('total').notNullable();
      tbl.integer('status');

      tbl.string('date_time'); // for debugging
      tbl.integer('date_index').unsigned().notNullable(); // for filtering on date-ranges
      tbl.integer('date_time_index').unsigned().notNullable(); // actual one used

      // -Foreign-key (Users)
      tbl
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user_id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      tbl.timestamps(false, true);
    })
    .createTable('order_2_product', (tbl: any) => {
      // -Primary-key
      tbl.increments('id');

      tbl.integer('quantity').notNullable();

      // -Foreign-key (Products)
      tbl
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('products')
        .onDelete('CASCADE') // vs. RESTRICT
        .onUpdate('CASCADE');

      // -Foreign-key (Orders)
      tbl
        .integer('order_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('orders')
        .onDelete('CASCADE') // vs. RESTRICT
        .onUpdate('CASCADE');
    })
    .createTable('messages', (tbl: any) => {
      tbl.increments('id'); // -Primary-key
      tbl.text('message');

      tbl.string('date_time'); // for debugging
      tbl.integer('date_time_index').notNullable(); // for sorting
      tbl.integer('date_index').notNullable(); // for filtering on date-range

      tbl.boolean('starred_to');
      tbl.boolean('starred_from');

      tbl.integer('category_to').unsigned();
      tbl.integer('category_from').unsigned();

      tbl.boolean('trash_to');
      tbl.boolean('trash_from');

      // tbl.boolean('draft_to');
      tbl.boolean('draft_from');

      tbl.boolean('read_to');
      tbl.boolean('read_from');

      // -Foreign-Key (Users)
      tbl
        .integer('user_id_to')
        .unsigned()
        // .notNullable() // we want nulllable possibility - if message is still a draft and the user has not specified who to send the message to
        .references('user_id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      // -Foreign-Key (Users)
      tbl
        .integer('user_id_from')
        .unsigned()
        // .notNullable() // we want nulllable possibility - if user does not have an account (no user_id), then we will just make value null
        .references('user_id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      tbl.timestamps(false, true);
    });
};

// ==============================================

exports.down = async (knex: any) => {
  await knex.schema
    .dropTableIfExists('messages')
    .dropTableIfExists('order_2_product')
    .dropTableIfExists('orders')
    .dropTableIfExists('products')
    .dropTableIfExists('users');
};
// ==============================================
