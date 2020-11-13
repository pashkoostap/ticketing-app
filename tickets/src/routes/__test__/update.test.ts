import request from 'supertest';
import { ObjectID } from 'mongodb';

import { app } from '../../app';
import { nats } from '../../nats';
import { Ticket } from '../../models';

describe('update ticket', () => {
  it('should return a 404 if the provided id does not exist', async () => {
    const id = new ObjectID();

    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', global.signin())
      .send({
        title: 'Ticket title',
        price: 20,
      })
      .expect(404);
  });

  it('should return a 401 if the user is not authenticated', async () => {
    const id = new ObjectID();

    await request(app)
      .put(`/api/tickets/${id}`)
      .send({
        title: 'Ticket title',
        price: 20,
      })
      .expect(401);
  });

  it('should return a 401 if the user does not own the ticket', async () => {
    const createResponse = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: 'Ticket title',
        price: 20,
      });
    await request(app)
      .put(`/api/tickets/${createResponse.body.id}`)
      .set('Cookie', global.signin())
      .send({
        title: 'New ticket title',
        price: 10,
      })
      .expect(401);
  });

  it('should return a 400 if the user provides an invalid title or price', async () => {
    const cookie = global.signin();
    const createResponse = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'Ticket title',
        price: 20,
      });
    await request(app)
      .put(`/api/tickets/${createResponse.body.id}`)
      .set('Cookie', cookie)
      .send({ title: null, price: 20 })
      .expect(400);
    await request(app)
      .put(`/api/tickets/${createResponse.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'Title', price: null })
      .expect(400);
  });

  it('should return 200 if valid input is provided', async () => {
    const cookie = global.signin();
    const createResponse = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'Ticket title',
        price: 20,
      });
    await request(app)
      .put(`/api/tickets/${createResponse.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'New title', price: 100 })
      .expect(200);
  });

  it('should publish a ticket:updated event', async () => {
    const cookie = global.signin();
    const createResponse = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({
        title: 'Ticket title',
        price: 20,
      });
    await request(app)
      .put(`/api/tickets/${createResponse.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'New title', price: 100 })
      .expect(200);

    expect(nats.client.publish).toHaveBeenCalled();
  });

  it('should reject the request if the ticket is reserved', async () => {
    const cookie = global.signin();
    const orderId = new ObjectID();
    const createRes = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send({ title: 'Ticket title', price: 20 });
    await Ticket.findOneAndUpdate(
      { _id: createRes.body.id },
      { orderId: orderId.toHexString() }
    );
    await request(app)
      .put(`/api/tickets/${createRes.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'New title', price: 100 })
      .expect(400);
  });
});
