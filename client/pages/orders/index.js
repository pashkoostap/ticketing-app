import React from 'react';
import Link from 'next/link';

const Orders = ({ orders }) => (
  <div className='col-12'>
    <table className='table' style={{ margin: '10px auto' }}>
      <thead>
        <tr>
          <th>Ticket</th>
          <th>Price</th>
          <th>Status</th>
          <th>Details</th>
        </tr>
      </thead>

      <tbody>
        {orders.length ? (
          orders.map((order) => (
            <tr key={order.id}>
              <td>{order.ticket.title}</td>
              <td>{order.ticket.price}</td>
              <td>{order.status}</td>
              <td>
                <Link href='/orders/[id]' as={`/orders/${order.id}`}>
                  <a>View</a>
                </Link>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan='4' className='text-center'>
              No orders yet
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

Orders.getInitialProps = async (ctx, client, currentUser) => {
  const { data: orders } = await client('/api/orders');

  return { orders };
};

export default Orders;
