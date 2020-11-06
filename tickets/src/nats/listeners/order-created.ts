import { Message } from 'node-nats-streaming';
import {
  Listener,
  OrderCreatedEvent,
  SubjectType,
} from '@pashkoostap_learning_ticketing/common';

import { groupName } from '../constants';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: SubjectType.OrderCreated = SubjectType.OrderCreated;
  groupName = groupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message): void {
    console.log(data);
  }
}
