import { Stan } from 'node-nats-streaming';

import { OrderCancelledListener } from './order-cancelled';
import { OrderCreatedListener } from './order-created';

export const listenToEvents = (client: Stan) => {
  new OrderCreatedListener(client).listen();
  new OrderCancelledListener(client).listen();
};
