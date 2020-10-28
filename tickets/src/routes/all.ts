import { Response, Router, Request } from 'express';

import { Ticket, TicketSchema } from '../models';

const router = Router();

router.get('/api/tickets', async (req, res) => {
  const tickets = await Ticket.find({});

  return res.status(200).send(tickets);
});

export { router as allTicketsRouter };
