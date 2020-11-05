import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@pashkoostap_learning_ticketing/common';
import { Response, Router, Request } from 'express';
import { body } from 'express-validator';

import { Ticket } from '../models';
import { TicketUpdatedPublisher, natsClient } from '../nats';

const router = Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const userId = req.currentUser?.id;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    if (ticket.userId !== userId) {
      throw new NotAuthorizedError('Permissions denied');
    }

    ticket.set({ title, price });
    await ticket.save();
    const publisher = new TicketUpdatedPublisher(natsClient.client);
    await publisher.publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
