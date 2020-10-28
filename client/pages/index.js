import { buildClient } from '../api';

const LandingPage = ({ currentUser }) => {
  if (!currentUser) return <h1>You are not signed in</h1>;

  return <h1>You are signed in</h1>;
};

LandingPage.getInitialProps = async (context) => {
  const { data } = await buildClient(context).get('/api/users/current');

  return data;
};

export default LandingPage;
