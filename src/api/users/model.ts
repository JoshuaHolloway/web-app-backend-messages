const db = require('../../../db-config.js');

import type { User } from '../../lib/types/User';

// ==============================================

function getAllUsers() {
  return db('users');
}

// ==============================================

function getUserByUsername(username: string) {
  return db('users').where('username', username);
}

// ==============================================

function getUserById(user_id: string) {
  return db('users').where('user_id', user_id);
}

// ==============================================

async function insertUser(user: User) {
  // WITH POSTGRES WE CAN PASS A "RETURNING ARRAY" AS 2ND ARGUMENT TO knex.insert/update
  // AND OBTAIN WHATEVER COLUMNS WE NEED FROM THE NEWLY CREATED/UPDATED RECORD
  // UNLIKE SQLITE WHICH FORCES US DO DO A 2ND DB CALL
  const [newUserObject] = await db('users').insert(user, [
    'user_id',
    'username',
    'password',
    'first_name',
    'last_name',
    'role',
    'date_index',
    'time_index',
  ]);
  return newUserObject; // { user_id: 7, username: 'foo', password: 'xxxxxxx' }
}

// ==============================================

export default {
  getAllUsers,
  getUserByUsername,
  getUserById,
  insertUser,
};
