import { requireAuth } from '@pashkoostap_learning_ticketing/common';
import { Router } from 'express';

import { Order } from '../models';

const router = Router();

router.get('/api/orders', requireAuth, async (req, res) => {
  const orders = await Order.find({
    userId: req.currentUser?.id,
  }).populate('ticket');

  res.status(200).send(orders);
});

export { router as getAllOrdersRouter };
