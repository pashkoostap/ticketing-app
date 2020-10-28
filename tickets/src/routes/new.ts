import { Response, Router, Request } from 'express';
import { body } from 'express-validator';

import {
  requireAuth,
  validateRequest,
} from '@pashkoostap_learning_ticketing/common';

import { Ticket, TicketSchema } from '../models';
import { TicketCreatedPublisher, natsClient } from '../nats';

const router = Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must me greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });
    const publisher = new TicketCreatedPublisher(natsClient.client);

    await publisher.publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: req.currentUser!.id,
    });
    await ticket.save();

    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
