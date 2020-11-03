import request from 'supertest';
import { ObjectId } from 'mongodb';

import { Order, OrderStatus, Ticket, TicketDoc } from '../../models';
import { app } from '../../app';

let ticket: TicketDoc | null = null;

beforeEach(async () => {
  ticket = Ticket.build({
    title: 'Ticket title',
    price: 20,
  });

  await ticket.save();
});

describe('create-order', () => {
  it('should return an error if the ticket does not exist', async () => {
    const ticketId = new ObjectId();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId })
      .expect(404);
  });

  it('should return an error if the ticket is already reserved', async () => {
    const order = Order.build({
      ticket: ticket as TicketDoc,
      userId: 'userId',
      status: OrderStatus.Created,
      expiresAt: new Date(),
    });
    await order.save();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: ticket?.id })
      .expect(400);
  });

  it('should reserve a ticket', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Cookie', global.signin())
      .send({ ticketId: ticket?.id });

    expect(res.status).toEqual(201);
  });

  it.todo('should emit an order:created event');
});