import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@pashkoostap_learning_ticketing/common';
import { Router } from 'express';
import { Order, OrderStatus } from '../models';

const router = Router();

router.put('/api/orders/:id', requireAuth, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('ticket');

  if (!order) {
    throw new NotFoundError('Order not found');
  }

  if (order.userId !== req.currentUser?.id) {
    throw new NotAuthorizedError();
  }

  order.set('status', OrderStatus.Cancelled);
  await order.save();

  res.status(200).send(order);
});

export { router as cancelOrderRouter };