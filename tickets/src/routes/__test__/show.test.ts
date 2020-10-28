import request from 'supertest';
import { ObjectID } from 'mongodb';

import { app } from '../../app';

describe('show ticket', () => {
  it('should return a 404 if the ticket is not found', async () => {
    await request(app).get(`/api/tickets/${new ObjectID()}`).send().expect(404);
  });
  it('should return the ticket', async () => {
    const [title, price] = ['Concert', 20];
    const res = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title, price });
    const ticketRes = await request(app)
      .get(`/api/tickets/${res.body.id}`)
      .set('Cookie', global.signin())
      .send()
      .expect(200);

    expect(ticketRes.body.title).toEqual(title);
    expect(ticketRes.body.price).toEqual(price);
  });
});
