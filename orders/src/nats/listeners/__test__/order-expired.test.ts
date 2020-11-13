import { ObjectID } from 'mongodb';
import { Message } from 'node-nats-streaming';
import {
  OrderExpiredEvent,
  OrderStatus,
} from '@pashkoostap-learning/ticketing-common';

import { nats } from '../../client';
import { Order, Ticket } from '../../../models';
import { OrderExpiredListener } from '../order-expired';

const setupListener = async () => {
  const listener = new OrderExpiredListener(nats.client);
  const ticket = Ticket.build({
    id: new ObjectID().toHexString(),
    title: 'Ticket title',
    price: 20,
  });
  await ticket.save();
  const order = Order.build({
    userId: new ObjectID().toHexString(),
    status: OrderStatus.AwaitingPayment,
    expiresAt: new Date(),
    ticket: ticket.id,
  });
  await order.save();
  const eventData: OrderExpiredEvent['data'] = {
    id: order.id,
  };
  // @ts-ignore
  const message: Message = { ack: jest.fn() };

  return { listener, eventData, message, ticket, order };
};

describe('listeners/order-expired', () => {
  it('should update order status to cancelled', async () => {
    const { listener, eventData, message, order } = await setupListener();

    await listener.onMessage(eventData, message);

    const updated = await Order.findById(order.id);

    expect(updated?.status).toEqual(OrderStatus.Cancelled);
  });

  it('should emit order:cancelled event', async () => {
    const { listener, eventData, message, order } = await setupListener();

    await listener.onMessage(eventData, message);

    const data = JSON.parse(
      (nats.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(data.id).toEqual(order.id);
  });

  it('should acknowledge the message', async () => {
    const { listener, eventData, message } = await setupListener();

    await listener.onMessage(eventData, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
