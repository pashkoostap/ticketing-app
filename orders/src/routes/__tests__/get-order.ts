import request from 'supertest';
import { ObjectID } from 'mongodb';

import { app } from '../../app';
import { Ticket } from '../../models';

describe('get-order', () => {
  it('should return 404 if order does not exists', async () => {
    await request(app)
      .get(`/api/orders/${new ObjectID()}`)
      .set('Cookie', global.signin())
      .expect(404);
  });

  it('should return 401 if user is not authorized', async () => {
    const userAuth = global.signin();
    const ticket = Ticket.build({
      title: 'Ticket title',
      price: 20,
    });
    await ticket.save();

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', userAuth)
      .send({
        ticketId: ticket.id,
      })
      .expect(201);
    await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', global.signin())
      .expect(401);
  });

  it('should return an order', async () => {
    const userAuth = global.signin();
    const ticket = Ticket.build({
      title: 'Ticket title',
      price: 20,
    });
    await ticket.save();

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', userAuth)
      .send({
        ticketId: ticket.id,
      })
      .expect(201);
    await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', userAuth)
      .expect(200);
  });
});
