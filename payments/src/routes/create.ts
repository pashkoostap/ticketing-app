import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@pashkoostap-learning/ticketing-common';
import { Request, Response, Router } from 'express';
import { body } from 'express-validator';

import { Order, Payment } from '../models';
import { nats, PaymentCreatedPublisher } from '../nats';
import { stripe } from '../stripe';

const router = Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Order has been cancelled');
    }

    const { id: stripeId } = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({ orderId, stripeId });
    await payment.save();

    const publisher = new PaymentCreatedPublisher(nats.client);
    publisher.publish({
      id: payment._id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(204).send(payment);
  }
);

export { router as createPaymentRouter };
