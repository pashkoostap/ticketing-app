import { ObjectID } from 'mongodb';
import { Message } from 'node-nats-streaming';
import {
  SubjectType,
  TicketCreatedEvent,
} from '@pashkoostap-learning/ticketing-common';

import { TicketCreatedListener } from '../ticket-created';
import { natsClient } from '../../client';
import { Ticket } from '../../../models';

const setupListener = async () => {
  const listener = new TicketCreatedListener(natsClient.client);
  const eventData: TicketCreatedEvent['data'] = {
    id: new ObjectID().toHexString(),
    title: 'Ticket title',
    price: 20,
    userId: new ObjectID().toHexString(),
    version: 0,
  };
  // @ts-ignore
  const message: Message = { ack: jest.fn() };

  return { listener, eventData, message };
};

describe('listeners/ticket-created', () => {
  it('should create and save a ticket', async () => {
    const { listener, eventData, message } = await setupListener();

    await listener.onMessage(eventData, message);

    const ticket = await Ticket.findById(eventData.id);

    expect(ticket).toBeDefined();
  });

  it('should acknowledge the message', async () => {
    const { listener, eventData, message } = await setupListener();

    await listener.onMessage(eventData, message);

    expect(message.ack).toHaveBeenCalled();
  });
});
