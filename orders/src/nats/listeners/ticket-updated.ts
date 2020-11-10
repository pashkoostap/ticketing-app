import { Message } from 'node-nats-streaming';

import {
  Listener,
  SubjectType,
  TicketUpdatedEvent,
} from '@pashkoostap-learning/ticketing-common';
import { groupName } from '../constants';
import { Ticket } from '../../models';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: SubjectType.TicketUpdated = SubjectType.TicketUpdated;
  groupName = groupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { id, title, price, version } = data;
    const ticket = await Ticket.findByPreviousVersion({
      id,
      version: version - 1,
    });

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ title, price });
    await ticket.save();
    msg.ack();
  }
}
