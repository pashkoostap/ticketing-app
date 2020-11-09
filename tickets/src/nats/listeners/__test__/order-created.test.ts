import {
  OrderCreatedEvent,
  OrderStatus,
} from '@pashkoostap_learning_ticketing/common';
import { ObjectID } from 'mongodb';
import { Ticket } from '../../../models';

import { natsClient } from '../../client';
import { OrderCreatedListener } from '../order-created';

const setupListener = async () => {
  const listener = new OrderCreatedListener(natsClient.client);
  const ticket = Ticket.build({
    title: 'Ticket title',
    price: 20,
    userId: new ObjectID().toHexString(),
  });
  await ticket.save();
  const eventData: OrderCreatedEvent['data'] = {
    id: new ObjectID().toHexString(),
    userId: new ObjectID().toHexString(),
    expiresAt: new Date().toISOString(),
    status: OrderStatus.Created,
    ticket: {
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
    },
  };
  // @ts-ignore
  const message: Message = { ack: jest.fn() };

  return { listener, eventData, message, ticket };
};

describe('listeners:order-created', () => {
  it('should set the userId of the ticket', async () => {
    const { listener, ticket, eventData, message } = await setupListener();

    await listener.onMessage(eventData, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.orderId).toEqual(eventData.id);
  });

  it('should ack the message', async () => {
    const { listener, ticket, eventData, message } = await setupListener();

    await listener.onMessage(eventData, message);

    expect(message.ack).toHaveBeenCalled();
  });

  it('should publish a ticket:update event', async () => {
    const { listener, ticket, eventData, message } = await setupListener();

    await listener.onMessage(eventData, message);

    expect(natsClient.client.publish).toHaveBeenCalled();

    const ticketUpdatedEventData = JSON.parse(
      (natsClient.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(ticketUpdatedEventData.orderId).toEqual(eventData.id);
  });
});
