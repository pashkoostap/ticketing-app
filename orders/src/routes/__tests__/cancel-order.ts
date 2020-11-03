import request from 'supertest';
import { ObjectID } from 'mongodb';

import { app } from '../../app';
import { OrderStatus, Ticket } from '../../models';

describe('cancel-order', () => {
  it('should return 404 if order does not exists', async () => {
    await request(app)
      .put(`/api/orders/${new ObjectID()}`)
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
      .put(`/api/orders/${order.id}`)
      .set('Cookie', global.signin())
      .expect(401);
  });

  it('should change the order status to cancelled', async () => {
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
    const { body: updateOrder } = await request(app)
      .put(`/api/orders/${order.id}`)
      .set('Cookie', userAuth)
      .expect(200);

    expect(updateOrder.status).toEqual(OrderStatus.Cancelled);
  });

  it.todo('should emit order:cancelled event');
});
