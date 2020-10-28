import React, { useEffect } from 'react';
import router from 'next/router';

import { useRequest } from '../../hooks';

const SignoutPage = () => {
  const { request } = useRequest({
    url: '/api/users/signout',
    method: 'POST',
    data: null,
  });

  useEffect(() => {
    request().then(() => router.push('/'));
  }, []);

  return <h1>Signing out...</h1>;
};

export default SignoutPage;
