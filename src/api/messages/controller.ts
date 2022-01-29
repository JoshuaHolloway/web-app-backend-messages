import { Request, Response, NextFunction } from 'express';

import HttpError from '../../lib/http-error';

import MessagesModel from './model';
import { dateTimeIndicesOfToday } from '../../lib/helpers/date-index';
import { MessageHttp } from '../../lib/types/MessageHttp';

// ==============================================

// [POST] /api/messages
const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  // Request:
  //  -URL-Params:
  //  -Headers:
  //    --Authorization [string]:   JWT
  //  -Body:
  //    --box:      string    'inbox'  | 'outbox'
  //    --sub_box:  string    'unread' | 'read'   | 'starred' | 'trash' | 'category'
  //    --user_id:  number    used to grab all messages from this user (outbox) or vice versa (inbox)
  // Model:
  //  -getMessages()
  //
  // Response:
  //  -messages: {  }[]

  console.log(
    '[POST] /api/messages/',
    '\nres.locals: ',
    res.locals,
    '\nreq.body: ',
    req.body
  );

  try {
    const { box, sub_box, category } = req.body;

    const { userId: user_id } = res.locals.decoded_token;

    let rows: MessageHttp[] | null;
    if (box === 'inbox') {
      rows = await MessagesModel.getInbox({
        user_id,
        box,
        sub_box,
        category,

        // order_by,
        // sort_type,
        // rows_per_page,
        // page_num,
        // date_lo,
        // date_hi,
      });
    } else if (box === 'outbox') {
      rows = await MessagesModel.getOutbox({
        user_id,
        box,
        sub_box,
        category,
      });
    } else {
      throw new Error('Invalid box');
    }

    if (rows === null) {
      throw new Error('Error retrieving messages');
    }

    res.status(200).json(rows);
  } catch (err: any) {
    next(
      new HttpError(err.message || '[GET] /api/messages', err.status || 400)
    );
  }
};

// ==============================================

// [POST] /api/messages
const createMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Request:
  //  -URL-Params:
  //  -Headers:
  //  -Body:
  //    --email     [string]
  //    --message   [string]
  //
  // Model:
  //  -createMessage()
  //
  // Response:
  //  -

  const { message, status, starred, user_id_to } = req.body;

  // NOTE: THIS IS NOT WORKING YET!!
  // NOTE: THIS IS NOT WORKING YET!!
  // NOTE: THIS IS NOT WORKING YET!!
  // NOTE: THIS IS NOT WORKING YET!!

  console.log(
    '(controller) [POST] /api/messages',
    '\nres.locals.decoded_jwt:',
    res.locals.decoded_jwt
  );

  const { username, role, userId: user_id_from } = res.locals.decoded_token;

  const { date_index, date_time_index, debugging_date_time } =
    dateTimeIndicesOfToday();

  try {
    await MessagesModel.createMessage({
      message,
      status,
      starred,
      date_time: debugging_date_time,
      date_time_index,
      date_index,
      user_id: user_id_from,
    });

    res.status(200).json({ message: 'message created' });
  } catch (err: any) {
    next(
      new HttpError(err.message || '[GET] /api/messages', err.status || 400)
    );
  }
};

// ==============================================

// [POST] /api/messages/update-status/:new_status
const updateStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message_ids: number[] = req.body.message_ids;
  const new_status: number = Number(req.params.new_status);

  console.log(
    '[POST] /api/messages/update-status/:new_status - message_ids: ',
    message_ids
  );

  try {
    message_ids.forEach(async (message_id) => {
      const id = await MessagesModel.updateStatus(message_id, new_status);
    });

    res.status(200).json({ message: 'update successful!' });
  } catch (err: any) {
    next(
      new HttpError(
        err.message || '/api/messages/update-status/:message_id/:new_status',
        err.status || 400
      )
    );
  }
};

// ==============================================

export default {
  getMessages,
  createMessage,
  updateStatus,
};
