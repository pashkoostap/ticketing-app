import router from 'next/router';
import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  if (!currentUser)
    return <h2 className='text-center'>You are not signed in</h2>;

  return (
    <div className='col-12'>
      <table className='table' style={{ margin: '10px auto' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>

        <tbody>
          {tickets.length ? (
            tickets.map(({ id, title, price, orderId }) => (
              <tr key={id}>
                <td>{title}</td>
                <td>{price}</td>
                <td>{orderId ? 'Reserved' : '-'}</td>
                <td>
                  <Link href='/tickets/[id]' as={`/tickets/${id}`}>
                    <a>View</a>
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan='4' className='text-center'>
                No tickets yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return {
    tickets: data,
    currentUser,
  };
};

export default LandingPage;
