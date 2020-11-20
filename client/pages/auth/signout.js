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

  return <h2>Signing out...</h2>;
};

export default SignoutPage;
