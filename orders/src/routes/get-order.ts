import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@pashkoostap-learning/ticketing-common';
import { Router } from 'express';
import { Order } from '../models';

const router = Router();

router.get('/api/orders/:id', requireAuth, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('ticket');

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  if (order.userId !== req.currentUser?.id) {
    throw new NotAuthorizedError();
  }

  res.status(200).send(order);
});

export { router as getOrderRouter };
