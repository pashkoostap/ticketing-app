import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  SubjectType,
} from '@pashkoostap-learning/ticketing-common';
import { Message } from 'node-nats-streaming';

import { groupName } from '../constants';
import { expirationQueue } from '../../queues';
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: SubjectType.OrderCreated = SubjectType.OrderCreated;
  groupName = groupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - Date.now();

    await expirationQueue.add({ orderId: data.id }, { delay });

    msg.ack();
  }
}
