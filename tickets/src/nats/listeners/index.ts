import { Stan } from 'node-nats-streaming';

import { OrderCreatedListener } from './order-created';
import { OrderCancelledListener } from './order-cancelled';

export const listenToEvents = (client: Stan) => {
  new OrderCreatedListener(client).listen();
  new OrderCancelledListener(client).listen();
};
