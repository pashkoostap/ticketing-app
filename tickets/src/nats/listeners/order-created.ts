import { Message } from 'node-nats-streaming';
import {
  Listener,
  OrderCreatedEvent,
  SubjectType,
} from '@pashkoostap_learning_ticketing/common';

import { groupName } from '../constants';
import { Ticket } from '../../models';
import { TicketUpdatedPublisher } from '../publishers';
import { natsClient } from '../client';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: SubjectType.OrderCreated = SubjectType.OrderCreated;
  groupName = groupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id, ticket } = data;
    const existing = await Ticket.findById(ticket.id);

    if (!existing) {
      throw new Error('Ticket not found');
    }

    existing.set({ orderId: id });
    await existing.save();
    const publisher = new TicketUpdatedPublisher(this.client);
    await publisher.publish({
      id: existing.id,
      title: existing.title,
      price: existing.price,
      userId: existing.userId,
      version: existing.version,
      orderId: existing.orderId,
    });

    msg.ack();
  }
}
