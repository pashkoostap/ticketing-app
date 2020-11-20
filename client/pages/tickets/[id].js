import React, { useState } from 'react';
import { useRequest } from '../../hooks';
import Link from 'next/link';
import router from 'next/router';

const TicketDetail = ({ ticket }) => {
  const { title, price, id, orderId } = ticket;
  const { request, errors } = useRequest({
    url: '/api/orders',
    method: 'POST',
    data: {
      ticketId: id,
    },
  });
  const onPurchase = async () => {
    const order = await request();

    router.push(`/orders/${order.id}`);
  };

  return (
    <div className='col-12' style={{ margin: '10px auto' }}>
      <table className='table'>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Order</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{title}</td>
            <td>{price}</td>
            <td>
              {orderId ? (
                <Link href='/orders/[id]' as={`/orders/${orderId}`}>
                  <a>View</a>
                </Link>
              ) : (
                <button className='btn  btn-primary' onClick={onPurchase}>
                  Purchase
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {errors}
    </div>
  );
};

TicketDetail.getInitialProps = async (ctx, client) => {
  const { data: ticket } = await client.get(`/api/tickets/${ctx.query.id}`);

  return { ticket };
};

export default TicketDetail;
