import request from 'supertest';

import { app } from '../../app';
import { Ticket } from '../../models';
import { natsClient } from '../../nats/client';

describe('new ticket', () => {
  it('has a route handler listening to /api/tickets POST requests', async () => {
    const response = await request(app).post('/api/tickts').send({});

    expect(response.status).not.toEqual(400);
  });

  it('can only be accessed if the user is signed in', async () => {
    const response = await request(app).post('/api/tickets').send({});

    expect(response.status).toEqual(401);
  });

  it('returns a status other than 401 if the use is signed in', async () => {
    const response = await await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it('return an error if an invalid title is provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: '', price: 10 })
      .expect(400);
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ price: 10 })
      .expect(400);
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: null, price: 10 })
      .expect(400);
  });

  it('return an error if an invalid price is provided', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: 'Ticket title', price: null })
      .expect(400);
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: 'Ticket title', price: -100 })
      .expect(400);
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: 'Ticket title' })
      .expect(400);
  });

  it('creates a ticket with valid inputs', async () => {
    let tickets = await Ticket.find({});

    expect(tickets).toHaveLength(0);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title: 'Ticket title',
        price: 20,
      })
      .expect(201);

    tickets = await Ticket.find({});

    expect(tickets).toHaveLength(1);
    expect(tickets[0].title).toEqual('Ticket title');
    expect(tickets[0].price).toEqual(20);
  });

  it('should publish an ticket:created event', async () => {
    const title = 'Ticket title';

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
        title,
        price: 20,
      })
      .expect(201);

    expect(natsClient.client.publish).toHaveBeenCalled();
  });
});
