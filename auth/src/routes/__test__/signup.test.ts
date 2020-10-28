import request from 'supertest';

import { app } from '../../app';

describe('POST /api/users/signup', () => {
  it('should return a 201 on a successfull signup', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'email@email.com',
        password: 'password',
      })
      .expect(201);
  });

  it('should return a 400 status with an invalid email', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'invalid-email',
        password: 'password',
      })
      .expect(400);
  });

  it('should return a 400 status with an invalid password', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@email.com',
        password: '',
      })
      .expect(400);
  });

  it('should return a 400 status with missing email and  password', async () => {
    return request(app).post('/api/users/signup').send().expect(400);
  });

  it('should not allow to use duplicated emails', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@email.com',
        password: 'password',
      })
      .expect(201);

    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@email.com',
        password: 'password',
      })
      .expect(400);
  });

  it('should set a cookie after successfull signup', async () => {
    const res = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@email.com',
        password: 'password',
      })
      .expect(201);

    expect(res.get('Set-Cookie')).toBeDefined();
  });
});
