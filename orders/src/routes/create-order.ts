import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@pashkoostap-learning/ticketing-common';

import { Order, Ticket } from '../models';
import { OrderCreatedPublisher, nats, OrderExpiredPublisher } from '../nats';

const router = Router();

const EXPIRATION_SECONDS = 5 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [body('ticketId').not().isEmpty().withMessage('Ticket id is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    const isTicketReserved = await ticket.isReserved();

    if (isTicketReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRATION_SECONDS);

    const order = Order.build({
      ticket,
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt,
    });
    await order.save();

    const publisher = new OrderCreatedPublisher(nats.client);
    publisher.publish({
      id: order.id,
      userId: req.currentUser!.id,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
      },
    });

    const delay = new Date(expiresAt.toISOString()).getTime() - Date.now();

    // HOTFIX
    setTimeout(() => {
      const publisher = new OrderExpiredPublisher(nats.client);

      publisher.publish({
        id: order._id,
      });
    }, delay);

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
