import request from 'supertest';
import { ObjectID } from 'mongodb';
import { OrderDoc, Ticket } from '../../models';
import { app } from '../../app';

const createTicket = async () => {
  const ticket = Ticket.build({
    id: new ObjectID().toHexString(),
    title: 'Ticket title',
    price: 20,
  });

  await ticket.save();

  return ticket;
};

describe('get-all', () => {
  it(`should return user's orders`, async () => {
    const [userOne, userTwo] = [global.signin(), global.signin()];
    const [ticketOne, ticketTwo, ticketThree] = [
      await createTicket(),
      await createTicket(),
      await createTicket(),
    ];

    const { body: orderOne } = await request(app)
      .post(`/api/orders`)
      .set('Cookie', userOne)
      .send({
        ticketId: ticketOne.id,
      })
      .expect(201);
    const { body: orderTwo } = await request(app)
      .post(`/api/orders`)
      .set('Cookie', userOne)
      .send({
        ticketId: ticketTwo.id,
      })
      .expect(201);
    await request(app)
      .post(`/api/orders`)
      .set('Cookie', userTwo)
      .send({
        ticketId: ticketThree.id,
      })
      .expect(201);

    const res = await request(app).get('/api/orders').set('Cookie', userOne);

    expect(res.body).toHaveLength(2);
    expect(res.body.map((i: OrderDoc) => i.id)).toEqual([
      orderOne.id,
      orderTwo.id,
    ]);
  });
});
