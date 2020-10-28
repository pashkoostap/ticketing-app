import request from 'supertest';

import { app } from '../../app';

describe('POST /api/users/signin', () => {
  it('should fail when an user does not exists', async () => {
    await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@email.com',
        password: 'password',
      })
      .expect(400);
  });

  it('should faild when password is incorrect', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@email.com',
        password: 'password',
      })
      .expect(201);

    return request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@email.com',
        password: 'password1',
      })
      .expect(400);
  });

  it('should return a cookie when given valid credentials', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@email.com',
        password: 'password',
      })
      .expect(201);

    const res = await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test@email.com',
        password: 'password',
      })
      .expect(200);

    expect(res.get('Set-Cookie')).toBeDefined();
  });
});
