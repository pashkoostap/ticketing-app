import 'bootstrap/dist/css/bootstrap.css';

import { buildClient } from '../api';
import { Header } from '../components';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />

      <Component {...pageProps} />
    </div>
  );
};

AppComponent.getInitialProps = async (context) => {
  const client = buildClient(context.ctx);
  const { data } = await client.get('/api/users/current');
  let pageProps = {};

  if (context.Component.getInitialProps) {
    pageProps = await context.Component.getInitialProps(context.ctx);
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
