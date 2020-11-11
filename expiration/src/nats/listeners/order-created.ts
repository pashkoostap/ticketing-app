import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  SubjectType,
} from '@pashkoostap-learning/ticketing-common';
import { Message } from 'node-nats-streaming';

import { groupName } from '../constants';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: SubjectType.OrderCreated = SubjectType.OrderCreated;
  groupName = groupName;

  onMessage(data: OrderCreatedEvent['data'], msg: Message) {}
}
