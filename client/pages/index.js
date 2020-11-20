import router from 'next/router';
import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  if (!currentUser) return <h2>You are not signed in</h2>;

  return (
    <div className='col-12'>
      <div className='d-flex'>
        <button
          className='btn  btn-primary'
          style={{ margin: '10px 0 10px auto' }}
          onClick={() => router.push('/tickets/new')}
        >
          New ticket
        </button>
      </div>

      <table className='table'>
        <thead>
          <th>Title</th>
          <th>Price</th>
          <th>Order</th>
          <th>Details</th>
        </thead>
        <tbody>
          {tickets.map(({ id, title, price, orderId }) => (
            <tr key={id}>
              <td>{title}</td>
              <td>{price}</td>
              <td>{orderId || '-'}</td>
              <td>
                <Link href='/tickets/[id]' as={`/tickets/${id}`}>
                  <a>View</a>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return {
    tickets: data,
  };
};

export default LandingPage;
