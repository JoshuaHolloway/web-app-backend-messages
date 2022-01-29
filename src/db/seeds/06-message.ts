import {
  randomIntFromInterval,
  randomIntFromIntervalOrNull,
  randIntFromIntervalExcluding,
  randBoolean,
} from '../../lib/helpers/rand';

import {
  date2Index,
  // time2Index,
  start_of_time,
  getDaysInMonth,
  dateTime2Index,
} from '../../lib/helpers/date-index';

import { Message } from '../../lib/types/Message';

// ==============================================

const texts = [
  'Eu pariatur voluptate occaecat non voluptate irure minim commodo ad ad commodo sunt. Consectetur non qui ipsum nulla commodo proident elit magna velit mollit esse pariatur esse. Fugiat fugiat aliqua quis proident aliquip labore magna enim. Non irure voluptate culpa magna est quis. Velit minim adipisicing exercitation pariatur eiusmod. Exercitation commodo proident non nulla id magna magna.',
  'Consectetur non qui ipsum nulla commodo proident elit magna velit mollit esse pariatur esse. Fugiat fugiat aliqua quis proident aliquip labore magna enim. Non irure voluptate culpa magna est quis. Velit minim adipisicing exercitation pariatur eiusmod. Exercitation commodo proident non nulla id magna magna. Eu pariatur voluptate occaecat non voluptate irure minim commodo ad ad commodo sunt.',
];

const emails = ['josh@josh.com', 'user@user.com', 'admin@admin.com']; // should correspond to users from the Users table

const categories = [
  'inventory question',
  'billing question',
  'account question',
];

// ==============================================

const today = new Date();
const today_y = today.getFullYear();
const today_m = today.getMonth();
const today_d = today.getDate();
const today_hr = today.getHours();
// const today_min = today.getMinutes();

interface DateType {
  y: number;
  m: number;
  d: number;
}

const date_range_hi: DateType = {
  y: today.getFullYear(),
  m: today.getMonth(),
  d: today.getDate(),
};

// ==============================================

const createMessages = ({
  num_messages,
  date_range_lo = {
    y: start_of_time.y,
    m: start_of_time.m,
    d: start_of_time.d,
  },
}: {
  num_messages: number;
  date_range_lo: DateType;
}): Message[] => {
  const messages: Message[] = [];

  for (let i = 0; i < num_messages; ++i) {
    const y = randomIntFromInterval(date_range_lo.y, date_range_hi.y);

    let m: number;
    if (y === today_y) {
      m = randomIntFromInterval(0, date_range_hi.m);
    } else {
      m = randomIntFromInterval(date_range_lo.m, 11);
    }

    let d: number;
    if (y === today_y && m === today_m) {
      d = randomIntFromInterval(1, date_range_hi.d);
    } else {
      d = randomIntFromInterval(date_range_lo.d, getDaysInMonth(y, m));
    }
    const date_index = date2Index({ y, m, d });

    // [9, 17] = [9am, 5pm]
    let hr: number;
    if (d === today_d) {
      hr = randomIntFromInterval(9, today_hr);
    } else {
      hr = randomIntFromInterval(9, 17);
    }

    let min: number;
    if (d === today_d && hr === today_hr) {
      min = randomIntFromInterval(9, 17);
    } else {
      min = randomIntFromInterval(0, 59);
    }

    // const time_index = time2Index({ h: hr, m: min });

    const user_id_to = randomIntFromInterval(1, emails.length);
    const user_id_from = randIntFromIntervalExcluding({
      min: 1,
      max: emails.length,
      exclude: user_id_to,
    });

    const message = texts[randomIntFromInterval(0, texts.length - 1)];

    messages.push({
      user_id_to,
      user_id_from,
      message,
      date_time_index: dateTime2Index(new Date(y, m, d, hr, min)), // for sorting
      date_index, // for filtering on date-ranges
      date_time: `${y}-${m}-${d} @ ${hr}:${min}`, // for debugging
      starred_to: randBoolean(),
      starred_from: randBoolean(),
      category_from: randomIntFromIntervalOrNull(0, categories.length - 1),
      category_to: randomIntFromIntervalOrNull(0, categories.length - 1),
      trash_from: randBoolean(),
      trash_to: randBoolean(),
      read_to: randBoolean(),
      read_from: randBoolean(),
      draft_from: false,
    });
  }
  return messages;
};

// ==============================================

exports.seed = function (knex: any, Promise: any) {
  // --------------------------------------------

  return knex('messages').insert(
    createMessages({
      num_messages: 80,
      date_range_lo: { y: 2022, m: 0, d: 14 },
    })
  );

  // --------------------------------------------
};
