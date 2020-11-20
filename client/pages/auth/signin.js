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
    <div className='col-6  offset-3'>
      <form onSubmit={onSubmit}>
        <h2>Sign in</h2>
        <div className='form-group'>
          <label>Email address</label>
          <input
            className='form-control'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className='form-group'>
          <label>Password</label>
          <input
            className='form-control'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {errors}

        <button className='btn  btn-primary'>Sign in</button>
      </form>
    </div>
  );
};

export default SigninPage;
