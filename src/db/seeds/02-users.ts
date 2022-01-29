import { dateTimeIndicesOfToday } from '../../lib/helpers/date-index';

const { date_index, time_index, debugging_date_time } =
  dateTimeIndicesOfToday();

exports.seed = function (knex: any, Promise: any) {
  // --------------------------------------------

  const user1 = {
    username: 'josh@josh.com',
    password: '$2a$08$ooXR4yG7Fp5oYcKgzw2jU.MkYwpQTI5jrDrcrqB6vpBKaX5aZKP0S', // josh
    first_name: 'josh ',
    last_name: 'holloway',
    role: 'customer',
    date_index,
    time_index,
  };

  // --------------------------------------------

  const user2 = {
    username: 'user@user.com',
    password: '$2a$08$toz3x48FU6Lu1pmO/fGC2.l8d61M78p4rusKCUQOON9vgLSqj9Aoa', // user
    first_name: 'sergie ',
    last_name: 'brin',
    role: 'customer',
    date_index,
    time_index,
  };

  // --------------------------------------------

  const user3 = {
    username: 'steve@apple.com',
    password: '$2a$08$mfSZbSNhew9aBGIUSpAk9OVOf70RDZRzwtelywzlU.6C8QFJNhENu', // apple
    first_name: 'steve',
    last_name: 'jobs',
    role: 'admin',
    date_index,
    time_index,
  };

  // --------------------------------------------

  const user4 = {
    username: 'admin@admin.com',
    password: '$2a$08$tJxw7X1cThO1/6toTQtnC.vQwXYoEQMeCP.oB/3nC1n6CrOpM4PTy', // admin
    first_name: 'elon',
    last_name: 'musk',
    role: 'admin',
    date_index,
    time_index,
  };

  // --------------------------------------------

  return knex('users').insert([user1, user2, user3, user4]);

  // --------------------------------------------
};
