import request from 'supertest';
import { app } from '../../app';

describe('GET /api/users/current', () => {
  it('should return details about the current user', async () => {
    const signupRes = await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@email.com',
        password: 'password',
      })
      .expect(201);
    const cookie = signupRes.get('Set-Cookie');
    const currentUserRes = await request(app)
      .get('/api/users/current')
      .set('Cookie', cookie)
      .send({})
      .expect(200);

    expect(currentUserRes.body.currentUser.email).toEqual('test@email.com');
  });

  it('should return null if not authenticated', async () => {
    const res = await request(app).get('/api/users/current').send().expect(200);

    expect(res.body.currentUser).toBeNull();
  });
});
