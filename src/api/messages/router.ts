import { Router } from 'express';
const router = Router();

import controller from './controller';
import middleware from './middleware';
import authMiddleware from '../auth/middleware';

// ==============================================

// [POST] /api/messages
router.post(
  '/',
  authMiddleware.restricted,
  // middleware.authorization,
  controller.getMessages
);

// ==============================================

// [POST] /api/messages
// -Anyone can create a message
//    --Un-logged in customer can send message to the admin   (user_id_from will be null in row of messages table)
//    --Un-sent message that is auto-saved to drafts          (user_id_to   will be null in row of messages table)
router.post('/', controller.createMessage);

// ==============================================

// [GET] /api/messages/update-status/:message_id
// -Anyone can create a message.
router.post('/update-status/:new_status', controller.updateStatus);

// ==============================================

export default router;
