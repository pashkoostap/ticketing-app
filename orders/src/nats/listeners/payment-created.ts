import {
  Listener,
  OrderStatus,
  PaymentCreatedEvent,
  SubjectType,
} from '@pashkoostap-learning/ticketing-common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models';

import { groupName } from '../constants';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: SubjectType.PaymentCreated = SubjectType.PaymentCreated;
  groupName = groupName;
  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Completed });
    await order.save();
  }
}
