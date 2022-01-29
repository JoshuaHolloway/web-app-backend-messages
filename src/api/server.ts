import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const server = express();

import authRouter from './auth/router';
import productsRouter from './products/router';
import usersRouter from './users/router';
import checkoutRouter from './checkout/router';
import ordersRouter from './orders/router';
import dataRouter from './data/router';
import messagesRouter from './messages/router';

// ==============================================

// Middleware
server.use(express.json()); // parse request body as JSON
server.use(cors());

// ==============================================

// Routes
server.use('/api/auth', authRouter);
server.use('/api/products', productsRouter);
server.use('/api/users', usersRouter);
server.use('/api/checkout', checkoutRouter);
server.use('/api/orders', ordersRouter);
server.use('/api/data', dataRouter);
server.use('/api/messages', messagesRouter);

// ==============================================

// Catch-All Endpoint
server.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    message: 'endooint not found',
  });
});

// ==============================================

// error-handling middleware
server.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(
    '**********\nerror handling middleware (auth-router)\n**********'
  );
  console.log('err (in error-handling middleware [server.js]): ', err);

  res.status(err.status || 500).json({ message: err.message });
});

// ==============================================

export default server;
