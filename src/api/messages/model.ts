const db = require('../../../db-config');

import { MessageHttp } from '../../lib/types/MessageHttp';

import { joinTablesMessages } from '../../lib/helpers/join-tables';

// ==============================================

const select = (_: { starred_to_from: string; category_to_from: string }) =>
  `SELECT u.username, m.${_.starred_to_from} as starred, u.first_name, u.last_name, m.user_id_from, m.user_id_to, m.date_time, m.date_time_index, m.date_index, m.${_.category_to_from} as category, m.message`;

const select_inbox = select({
  starred_to_from: 'starred_to',
  category_to_from: 'category_to',
});

// ==============================================

const getInbox = async ({
  user_id,
  box,
  sub_box,
  category,
}: // order_by,
// sort_type,
// rows_per_page,
// page_num,
// date_lo,
// date_hi,
{
  user_id: number;
  box: string;
  sub_box: string;
  category: number | null;
  // order_by:
  //   | 'date_time_index'
  //   | 'last_name'
  //   | 'first_name'
  //   | 'username'
  //   | 'total';
  // sort_type: 'asc' | 'desc';
  // rows_per_page: number;
  // page_num: number;
  // date_lo: number;
  // date_hi: number;
}): Promise<MessageHttp[] | null> => {
  // --------------------------------------------

  let cols = [
    'u.username',
    'u.first_name',
    'u.last_name',
    'm.user_id_from',
    'm.user_id_to',
    'm.date_time',
    'm.date_time_index',
    'm.date_index',
    'm.message',
    'm.category_to as category',
    'm.starred_to as starred',
  ];

  // --------------------------------------------

  if (sub_box === 'unread & read') {
    // -user viewing received messages (read & unread):
    const { rows } = await db.raw(`
      ${select_inbox}
      FROM users as u
      INNER JOIN messages as m ON u.user_id = m.user_id_from
      WHERE m.user_id_to = ${user_id};
    `);
    return rows;

    // const table1 = 'users',
    //   t1 = 'u';
    // const table2 = 'messages',
    //   t2 = 'm';

    // const rows = await db(` as ${t1}`)
    //   .join(`${table2} as ${t2}`, `${t1}.user_id`, `${t2}.user_id_from`)
    //   .select(cols)
    //   .orderBy(order_by, sort_type) // asc / desc
    //   .limit(rows_per_page)
    //   .offset(rows_per_page * page_num)
    //   .where(`${t2}.date_index`, '>=', date_lo)
    //   .where(`${t2}.date_index`, '<=', date_hi)
    //   .where(`${t2}.user_id_to`, '=', user_id);

    return rows;
  }

  // --------------------------------------------

  if (sub_box === 'unread') {
    // -user viewing received messages (unread):
    const { rows } = await db.raw(`
         ${select_inbox}
        FROM users as u
        INNER JOIN messages as m ON u.user_id = m.user_id_from
        WHERE m.user_id_to = ${user_id}
        AND m.read_to = false;
      `);
    return rows;
  }

  // --------------------------------------------

  if (sub_box === 'read') {
    // -user viewing received messages (read):
    const { rows } = await db.raw(`
         ${select_inbox}
        FROM users as u
        INNER JOIN messages as m ON u.user_id = m.user_id_from
        WHERE m.user_id_to = ${user_id}
        AND m.read_to = true;
      `);
    return rows;
  }

  // --------------------------------------------

  if (sub_box === 'starred') {
    // -user viewing received messages (starred):
    const { rows } = await db.raw(`
         ${select_inbox}
        FROM users as u
        INNER JOIN messages as m ON u.user_id = m.user_id_from
        WHERE m.user_id_to = ${user_id}
        AND m.starred_to = true;
      `);
    return rows;
  }

  // --------------------------------------------

  if (sub_box === 'category') {
    // -user viewing received messages (category = x):
    const { rows } = await db.raw(`        
         ${select_inbox}
        FROM users as u
        INNER JOIN messages as m ON u.user_id = m.user_id_from
        WHERE m.user_id_to = ${user_id}
        AND m.category_to =  ${category};
      `);
    console.log('rows: ', rows);
    return rows;
  }

  // --------------------------------------------

  if (sub_box === 'trash') {
    // -user viewing received messages (trash):
    const { rows } = await db.raw(`
         ${select_inbox}
        FROM users as u
        INNER JOIN messages as m ON u.user_id = m.user_id_from
        WHERE m.user_id_to = ${user_id}
        AND m.trash_to = true;
      `);
    return rows;
  }

  // --------------------------------------------

  // -If you make it here then there was an error => Handle in controller.
  return null; // to satisfy return-type (this return should never be hit)
};

// ==============================================

const getOutbox = async ({
  user_id,
  box,
  sub_box,
  category,
}: {
  user_id: number;
  box: string;
  sub_box: string;
  category: number | null;
}): Promise<MessageHttp[] | null> => {
  let cols = [
    'u.username',
    'u.first_name',
    'u.last_name',
    'm.user_id_from',
    'm.user_id_to',
    'm.date_time',
    'm.date_time_index',
    'm.date_index',
    'm.message',
  ];

  // --------------------------------------------

  if (box === 'outbox') {
    cols = [...cols, 'm.category_to as category', 'm.starred_to as starred'];

    if (sub_box === 'unread & read') {
      // user viewing sent messages (read & unread [by recipient]):
      const { rows } = await db.raw(`
        SELECT u.username as username, m.starred_from as starred, u.first_name, u.last_name, m.user_id_from, m.user_id_to, m.date_time, m.date_time_index, m.date_index, m.message
        FROM users as u
        INNER JOIN messages as m ON u.user_id = m.user_id_to
        WHERE m.user_id_from = ${user_id};
      `);
      return rows;
    }

    if (sub_box === 'unread') {
    }

    if (sub_box === 'read') {
    }

    if (sub_box === 'starred') {
    }

    if (sub_box === 'category') {
    }

    if (sub_box === 'trash') {
    }
  }

  // --------------------------------------------

  // -- ============================================

  // -- NOTE The last 2 here are tricky because they look at whether or not the OTHER person has read or not read the message you sent them

  // -- user-1 viewing sent (unread - the RECIPIENT has not read the message):
  // SELECT username as to_user, m.user_id_from, m.user_id_to, m.read_from
  // FROM users as u
  // INNER JOIN messages as m ON u.user_id = m.user_id_to
  // WHERE m.user_id_from = 1
  // AND m.read_to = false;  -- NOTE: Interested in messages sent FROM us that where NOT read by people we sent messages TO

  // -- user-1 viewing sent (read - the RECIPIENT has read the message):
  // SELECT username as to_user, m.user_id_from, m.user_id_to, m.read_to
  // FROM users as u
  // INNER JOIN messages as m ON u.user_id = m.user_id_to
  // WHERE m.user_id_from = 1
  // AND m.read_to = true;  -- NOTE: Interested in messages sent FROM us that where read by people we sent messages TO

  // -- ============================================

  // -- user-1 viewing sent (starred):
  // SELECT username as to_user, m.user_id_from, m.user_id_to, m.starred_from
  // FROM users as u
  // INNER JOIN messages as m ON u.user_id = m.user_id_to
  // WHERE m.user_id_from = 1
  // AND m.starred_from = true;

  // -- ============================================

  // -- user-1 viewing sent (category = x):
  // SELECT username as to_user, m.user_id_from, m.category_from
  // FROM users as u
  // INNER JOIN messages as m ON u.user_id = m.user_id_to
  // WHERE m.user_id_from = 1
  // AND m.category_from = 2;

  // -- ============================================

  // -- user-1 viewing sent (trash):
  // SELECT username as to_user, m.user_id_from, m.trash_from
  // FROM users as u
  // INNER JOIN messages as m ON u.user_id = m.user_id_to
  // WHERE m.user_id_from = 1
  // AND m.trash_from = true;

  // -If you make it here then there was an error => Handle in controller.
  return null; // to satisfy return-type (this return should never be hit)
};

// ==============================================

async function getAllMessages(
  rows_per_page: number,
  page: number,
  status: number,
  date_hi: number,
  date_lo: number,
  sort_index: number,
  sort_type: string,
  loggged_in_user_id: number
) {
  // Used by:
  //  -/api/data/controller - getDistinctProductsSoldInDateRange()

  console.log('(model)');

  // const { rows } = await db.raw(`
  //   SELECT message, date_index, date_time_index, date_time, email FROM messages
  //   ORDER BY date_time_index DESC
  //   ;
  // `);

  const table1 = 'users';
  const table2 = 'messages';

  const cols1 = ['user_id', 'username', 'first_name', 'last_name'];
  const cols2 = [
    'id as message_id', // for key-prop on the messages table AND for first SQL query in joinTables()
    'message',
    'status',
    'date_time', // for-debugging
    'date_time_index',
    'date_index', // for filtering on date-ranges
    'starred',
  ];

  const sort_map = ['date_time_index', 'last_name', 'first_name', 'username'];

  const { rows, row_count }: { rows: any[]; row_count: number } =
    await joinTablesMessages({
      db,
      table1,
      table2,
      cols1,
      cols2,
      date_lo,
      date_hi,
      page,
      rows_per_page,
      // ****************************************************************
      // ****************************************************************
      // ****************************************************************
      // ****************************************************************
      // ****************************************************************
      // ****************************************************************
      // TODO! Change this!
      // TODO! Change this!
      // TODO! Change this!
      // TODO! Change this!
      // TODO! Change this!
      // TODO! Change this!
      num_status_options: 4, // {unread, read, trash, inbox (read + unread)}
      // 4 represents all - we want (unread || read), trash, but we'd never want to see trash with the others
      status,
      sort_index,
      sort_type,
      sort_map,
      loggged_in_user_id,
    });

  console.log('rows: ', rows);

  return { rows, row_count };
}

// ==============================================

async function createMessage({
  message,
  status,
  starred,
  date_time,
  date_time_index,
  date_index,
  user_id,
}: {
  message: string;
  status: number;
  starred: boolean;
  date_time: string;
  date_time_index: number;
  date_index: number;
  user_id: number;
}) {
  // Used by:
  //  -[POST] /api/messages - createMessage()

  console.log('(model) [POST] /api/messages');

  await db.raw(`
    INSERT INTO messages 
      (message, status, starred, date_time, date_time_index, date_index, user_id) 
    VALUES (
      '${message}',
      ${status},
      ${starred},
      '${date_time}',
      ${date_time_index},
      ${date_index},
      ${user_id}
    );
  `);

  return;
}

// ==============================================

async function updateStatus(id: number, new_status: number) {
  const returned_id: string = await db('messages')
    .where('id', id)
    .update({ status: new_status });
  return returned_id;
}

// ==============================================

// module.exports = {
//   getOrders,
//   findById,
//   getUsersOrders,
//   insert,
// };
export default {
  getInbox,
  getOutbox,
  getAllMessages,
  createMessage,
  updateStatus,
};
