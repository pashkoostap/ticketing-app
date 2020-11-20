import React from 'react';
import { useRequest } from '../../hooks';

const TicketDetail = ({ ticket }) => {
  const { title, price, id } = ticket;
  const { request, errors } = useRequest({
    url: '/api/orders',
    method: 'POST',
    data: {
      ticketId: id,
    },
  });

  return (
    <div className='col-12'>
      <h2>{title}</h2>
      <h3>Price: {price}</h3>
      <button className='btn  btn-primary' onClick={request}>
        Purchase
      </button>
      {errors}
    </div>
  );
};

TicketDetail.getInitialProps = async (ctx, client) => {
  const {
    query: { id },
  } = ctx;

  const { data } = await client.get(`/api/tickets/${id}`);

  return { ticket: data };
};

export default TicketDetail;
