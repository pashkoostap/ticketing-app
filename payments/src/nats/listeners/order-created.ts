import { Message } from 'node-nats-streaming';

import {
  Listener,
  OrderCreatedEvent,
  SubjectType,
} from '@pashkoostap-learning/ticketing-common';
import { groupName } from '../constants';
import { Order } from '../../models';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: SubjectType.OrderCreated = SubjectType.OrderCreated;
  groupName = groupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const order = Order.build({
      id: data.id,
      userId: data.userId,
      status: data.status,
      price: data.ticket.price,
      version: data.version,
    });
    await order.save();

    msg.ack();
  }
}
