import { OrderCancelledEvent } from '@pashkoostap-learning/ticketing-common';
import { ObjectID } from 'mongodb';
import { Message } from 'node-nats-streaming';

import { Ticket } from '../../../models';
import { nats } from '../../client';
import { OrderCancelledListener } from '../order-cancelled';

const setupListener = async () => {
  const listener = new OrderCancelledListener(nats.client);
  const orderId = new ObjectID().toHexString();
  const ticket = Ticket.build({
    title: 'Ticket title',
    price: 20,
    userId: new ObjectID().toHexString(),
  });
  ticket.set({ orderId });
  await ticket.save();

  const eventData: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { ticket, eventData, listener, message };
};

describe('listeners:order-cancelled', () => {
  it('should update the ticket', async () => {
    const { ticket, eventData, listener, message } = await setupListener();

    await listener.onMessage(eventData, message);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.orderId).toBeUndefined();
    expect(message.ack).toHaveBeenCalled();
    expect(nats.client.publish).toHaveBeenCalled();
  });
});
