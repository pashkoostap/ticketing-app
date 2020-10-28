import request from 'supertest';
import { app } from '../../app';

describe('all tickets', () => {
  it('should return a list of tickets', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({ title: 'Ticket title', price: 20 });
    const ticketsRes = await request(app)
      .get('/api/tickets')
      .set('Cookie', global.signin())
      .send();

    expect(ticketsRes.body).toHaveLength(1);
  });
});
