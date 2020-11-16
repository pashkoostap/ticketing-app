import request from 'supertest';
import { ObjectID } from 'mongodb';

import { app } from '../../app';
import { Order } from '../../models';
import { OrderStatus } from '@pashkoostap-learning/ticketing-common';

describe('routes/create-charge', () => {
  it('should return 404 if order does not exist', async () => {
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({
        token: 'token',
        orderId: new ObjectID().toHexString(),
      })
      .expect(404);
  });

  it('should return 401 if user does not own the order', async () => {
    const order = Order.build({
      id: new ObjectID().toHexString(),
      userId: new ObjectID().toHexString(),
      price: 20,
      status: OrderStatus.Created,
      version: 0,
    });
    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin())
      .send({
        token: 'token',
        orderId: order._id,
      })
      .expect(401);
  });

  it('should return 400 if user tries to pay for cancelled order ', async () => {
    const order = Order.build({
      id: new ObjectID().toHexString(),
      userId: new ObjectID().toHexString(),
      price: 20,
      status: OrderStatus.Cancelled,
      version: 0,
    });
    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signin(order.userId))
      .send({
        token: 'token',
        orderId: order._id,
      })
      .expect(400);
  });
});
