import request from 'supertest';
import { ObjectID } from 'mongodb';
import { OrderStatus } from '@pashkoostap-learning/ticketing-common';

import { app } from '../../app';
import { Order, Payment } from '../../models';
import { stripe } from '../../stripe';

jest.mock('../../stripe');

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

  it('should return a 204 with valid inputs', async () => {
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
      .set('Cookie', global.signin(order.userId))
      .send({
        token: 'tok_visa',
        orderId: order._id,
      })
      .expect(204);

    const options = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    expect(options).toEqual({
      amount: order.price * 100,
      source: 'tok_visa',
      currency: 'usd',
    });
  });

  it('should create a payment', async () => {
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
      .set('Cookie', global.signin(order.userId))
      .send({
        token: 'tok_visa',
        orderId: order._id,
      })
      .expect(204);

    const payment = await Payment.findOne({ orderId: order._id });

    expect(payment).not.toBeNull();
  });
});
