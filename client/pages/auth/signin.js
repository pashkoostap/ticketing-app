import { useState } from 'react';
import router from 'next/router';

import { useRequest } from '../../hooks';

const SigninPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { request, errors } = useRequest({
    url: '/api/users/signin',
    method: 'POST',
    data: { email, password },
  });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await request();
      router.push('/');
    } catch (err) {}
  };

  return (
    <div className='container'>
      <div className='col-12'>
        <form onSubmit={onSubmit}>
          <h1>Sign in</h1>
          <div className='form-group'>
            <label>Email address</label>
            <input
              className='form-cotrol'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='form-group'>
            <label>Password</label>
            <input
              className='form-cotrol'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {errors}

          <button className='btn  btn-primary'>Sign in</button>
        </form>
      </div>
    </div>
  );
};

export default SigninPage;
