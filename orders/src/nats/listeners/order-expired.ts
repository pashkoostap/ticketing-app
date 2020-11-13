import { Message } from 'node-nats-streaming';
import {
  Listener,
  OrderExpiredEvent,
  OrderStatus,
  SubjectType,
} from '@pashkoostap-learning/ticketing-common';

import { groupName } from '../constants';
import { Order, Ticket } from '../../models';
import { OrderCancelledPublisher } from '../publishers';

export class OrderExpiredListener extends Listener<OrderExpiredEvent> {
  subject: SubjectType.OrderExpired = SubjectType.OrderExpired;
  groupName = groupName;
  async onMessage(data: OrderExpiredEvent['data'], msg: Message) {
    const order = await Order.findById(data.id);

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.Completed) {
      return msg.ack();
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();
    const publisher = new OrderCancelledPublisher(this.client);
    await publisher.publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket._id,
      },
    });

    msg.ack();
  }
}
