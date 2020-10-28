import request from 'supertest';
import { app } from '../../app';

describe('POST /api/users/signout', () => {
  it('should clear the cookie after signing out', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@email.com',
        password: 'password',
      })
      .expect(201);

    const res = await request(app)
      .post('/api/users/signout')
      .send({})
      .expect(200);

    expect(res.get('Set-Cookie')).toBeDefined();
  });
});
