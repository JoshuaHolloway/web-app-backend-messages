import { Request, Response, NextFunction } from 'express';

import HttpError from '../../lib/http-error';

// ==============================================

const authorization = (req: Request, res: Response, next: NextFunction) => {
  // Request:
  //  -res.locals:
  //    --decoded_token: {
  //        userId: 3,
  //        username: 'steve@apple.com',
  //        role: 'admin',
  //        iat: 1642881979,
  //        exp: 1642968379
  //      }
  //  -Headers:
  //    --Authorization [string]:   JWT
  //  -Body:
  //    --box:      string    'inbox'  | 'outbox' | 'starred' | 'trash' | 'category'
  //    --sub_box:  string    'unread' | 'read'   | 'starred' | 'trash' | 'category'
  //    --user_id:  number

  const { user_id } = req.body;
  const { userId: jwt_user_id } = res.locals;

  if (user_id === jwt_user_id) {
    next();
  } else {
    // -User is trying to access one of the following (and does not have authorization):
    //  --Inbound mail that was not sent to them
    //  --Outbound mail that was not sent by them
    next(new HttpError('Authorization failed', 422));
  }
};

// ==============================================

export default { authorization };
