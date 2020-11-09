import { Message } from 'node-nats-streaming';
import {
  Listener,
  OrderCancelledEvent,
  SubjectType,
} from '@pashkoostap_learning_ticketing/common';

import { groupName } from '../constants';
import { Ticket } from '../../models';
import { TicketUpdatedPublisher } from '../publishers';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: SubjectType.OrderCancelled = SubjectType.OrderCancelled;
  groupName = groupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: undefined });
    await ticket.save();

    const publisher = new TicketUpdatedPublisher(this.client);
    publisher.publish({
      id: ticket.id,
      orderId: ticket.orderId,
      userId: ticket.userId,
      title: ticket.title,
      price: ticket.price,
      version: ticket.version,
    });

    msg.ack();
  }
}
