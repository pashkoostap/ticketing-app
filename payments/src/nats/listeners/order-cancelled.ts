import { Message } from 'node-nats-streaming';

import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  SubjectType,
} from '@pashkoostap-learning/ticketing-common';
import { groupName } from '../constants';
import { Order } from '../../models';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: SubjectType.OrderCancelled = SubjectType.OrderCancelled;
  groupName = groupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
