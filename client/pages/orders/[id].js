import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import router from 'next/router';
import StripeCheckout from 'react-stripe-checkout';

import { useRequest } from '../../hooks';

const getTimeDiff = (expiresAt) =>
  Math.round((new Date(expiresAt) - new Date()) / 1000);

const OrderDetail = ({ order, currentUser }) => {
  if (!order || !currentUser) return null;

  const {
    id: orderId,
    expiresAt,
    status,
    ticket: { title, price, id: ticketId },
  } = order;
  const [timer, setTimer] = useState(0);
  const { request, errors } = useRequest({
    url: '/api/payments',
    method: 'POST',
    data: { orderId },
  });
  useEffect(() => {
    const interval = setInterval(() => {
      const value = getTimeDiff(expiresAt);

      if (value <= 0 && status === 'completed') {
        clearInterval(interval);
      }

      setTimer(value);
    }, 1000);

    setTimer(getTimeDiff(expiresAt));

    return () => clearInterval(interval);
  }, []);
  const onPayment = async (payment) => {
    const { id: token } = payment;

    await request({ token });

    router.push('/orders');
  };

  return (
    <div className='col-12'>
      <table
        className='table'
        style={{ margin: '10px auto', verticalAlign: 'middle' }}
      >
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Price</th>
            {status === 'completed' ? <th>Status</th> : <th>Expires in</th>}
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              <Link href='/tickets/[id]' as={`/tickets/${ticketId}`}>
                <a>{title}</a>
              </Link>
            </td>
            <td>{price}</td>
            {status === 'completed' ? (
              <td>Order completed</td>
            ) : (
              <td>
                <span style={{ paddingRight: 10 }}>
                  {timer > 0 ? `${timer} sec` : 'Order expired.'}
                </span>
                {timer > 0 ? (
                  <StripeCheckout
                    token={onPayment}
                    stripeKey='pk_test_51HoA1NBWg5v4rs4oVWx9BOI216QwLihwcZxqm8kpCCEIcbPGifiv9GpVo6MZLaOcHtMRtu76r81GNV7UsVfx2J6000Xm0Z5NUj'
                    amount={price * 100}
                    email={currentUser.email}
                  />
                ) : null}
              </td>
            )}
          </tr>
        </tbody>
      </table>

      {errors}
    </div>
  );
};

OrderDetail.getInitialProps = async (ctx, client, currentUser) => {
  const { data: order } = await client(`/api/orders/${ctx.query.id}`);

  return { order, currentUser };
};

export default OrderDetail;
