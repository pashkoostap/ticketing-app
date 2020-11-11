import { Stan } from 'node-nats-streaming';

import { OrderCreatedListener } from './order-created';

export const listenToEvents = (client: Stan) => {
  new OrderCreatedListener(client).listen();
};
