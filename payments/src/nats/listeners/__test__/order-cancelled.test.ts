import { ObjectID } from 'mongodb';
import { Message } from 'node-nats-streaming';

import {
  OrderCancelledEvent,
  OrderStatus,
} from '@pashkoostap-learning/ticketing-common';

import { nats } from '../../client';
import { OrderCancelledListener } from '../order-cancelled';
import { Order } from '../../../models';

const setupListener = async () => {
  const listener = new OrderCancelledListener(nats.client);
  const order = Order.build({
    id: new ObjectID().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId: new ObjectID().toHexString(),
    price: 10,
  });
  await order.save();
  const eventData: OrderCancelledEvent['data'] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: new ObjectID().toHexString(),
    },
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, eventData, order, message };
};

describe('listeners/order-cancelled', () => {
  it('should change the order status to cancellled', async () => {
    const { listener, eventData, order, message } = await setupListener();

    await listener.onMessage(eventData, message);

    const updated = await Order.findById(order.id);

    expect(updated?.status).toEqual(OrderStatus.Cancelled);
  });

  it('should acknowledge the message', async () => {
    const { listener, eventData, order, message } = await setupListener();

    await listener.onMessage(eventData, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
