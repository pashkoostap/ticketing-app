import { Message } from 'node-nats-streaming';
import {
  Listener,
  OrderCancelledEvent,
  SubjectType,
} from '@pashkoostap_learning_ticketing/common';

import { groupName } from '../constants';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: SubjectType.OrderCancelled = SubjectType.OrderCancelled;
  groupName = groupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message): void {
    console.log(data);
  }
}
