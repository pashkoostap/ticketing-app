import { Message } from 'node-nats-streaming';

import {
  Listener,
  SubjectType,
  TicketCreatedEvent,
} from '@pashkoostap-learning/ticketing-common';
import { groupName } from '../constants';
import { Ticket } from '../../models';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: SubjectType.TicketCreated = SubjectType.TicketCreated;
  groupName = groupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { title, price, id } = data;
    const ticket = Ticket.build({
      id: id,
      title,
      price,
    });
    await ticket.save();

    msg.ack();
  }
}
