import { useState } from 'react';
import router from 'next/router';

import { useRequest } from '../../hooks';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const onPriceTruncate = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };
  const { request, errors } = useRequest({
    url: '/api/tickets',
    method: 'POST',
    data: { title, price },
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
      <h2>Create new ticket</h2>

      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label>Title</label>
          <input
            className='form-control'
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>
        <div className='form-group'>
          <label>Price</label>
          <input
            className='form-control'
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onPriceTruncate}
            value={price}
          />
        </div>

        {errors}

        <button className='btn  btn-primary'>Create</button>
      </form>
    </div>
  );
};

export default NewTicket;
