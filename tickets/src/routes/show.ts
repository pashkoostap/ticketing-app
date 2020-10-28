import { NotFoundError } from '@pashkoostap_learning_ticketing/common';
import { Response, Router, Request } from 'express';
import { Ticket } from '../models';
const router = Router();

router.get('/api/tickets/:id', async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError('Ticket was not found');
  }

  res.status(200).send(ticket);
});

export { router as showTicketRouter };
