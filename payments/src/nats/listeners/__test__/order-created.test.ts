import { ObjectID } from 'mongodb';
import { Message } from 'node-nats-streaming';

import {
  OrderCreatedEvent,
  OrderStatus,
} from '@pashkoostap-learning/ticketing-common';

import { nats } from '../../client';
import { OrderCreatedListener } from '../order-created';
import { Order } from '../../../models';

const setup = async () => {
  const listener = new OrderCreatedListener(nats.client);
  const eventData: OrderCreatedEvent['data'] = {
    id: new ObjectID().toHexString(),
    userId: new ObjectID().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    expiresAt: new Date().toISOString(),
    ticket: {
      id: new ObjectID().toHexString(),
      title: 'Ticket title',
      price: 20,
    },
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, eventData, message };
};

describe('listeners/order-created', () => {
  it('should save an order', async () => {
    const { listener, eventData, message } = await setup();

    await listener.onMessage(eventData, message);

    const replicated = await Order.findById(eventData.id);

    expect(replicated?.price).toEqual(eventData.ticket.price);
  });

  it('should aknowledge the message', async () => {
    const { listener, eventData, message } = await setup();

    await listener.onMessage(eventData, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
