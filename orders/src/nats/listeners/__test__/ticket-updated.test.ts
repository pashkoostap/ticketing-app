import { ObjectID } from 'mongodb';
import { Message } from 'node-nats-streaming';
import {
  SubjectType,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from '@pashkoostap_learning_ticketing/common';

import { natsClient } from '../../client';
import { Ticket } from '../../../models';
import { TicketUpdatedListener } from '../ticket-updated';

const setupListener = async () => {
  const listener = new TicketUpdatedListener(natsClient.client);
  const ticket = Ticket.build({
    id: new ObjectID().toHexString(),
    title: 'Ticket title',
    price: 20,
  });
  await ticket.save();
  const eventData: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: ticket.title,
    price: 20,
    userId: new ObjectID().toHexString(),
    version: ticket.version + 1,
  };
  // @ts-ignore
  const message: Message = { ack: jest.fn() };

  return { listener, eventData, message };
};

describe('listeners/ticket-updated', () => {
  it('should update ticket', async () => {
    const { listener, eventData, message } = await setupListener();

    await listener.onMessage(eventData, message);

    const updated = await Ticket.findById(eventData.id);

    expect(updated?.title).toEqual(eventData.title);
    expect(updated?.price).toEqual(eventData.price);
    expect(updated?.version).toEqual(eventData.version);
  });

  it('should acknowledge the message', async () => {
    const { listener, eventData, message } = await setupListener();

    await listener.onMessage(eventData, message);

    expect(message.ack).toHaveBeenCalled();
  });

  it('should not call ack if the event has a skipped version', async () => {
    const { listener, eventData, message } = await setupListener();

    eventData.version = 10;

    try {
      await listener.onMessage(eventData, message);
    } catch (err) {}

    expect(message.ack).not.toHaveBeenCalled();
  });
});
