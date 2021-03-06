import { Stan } from 'node-nats-streaming';

import { OrderExpiredListener } from './order-expired';
import { PaymentCreatedListener } from './payment-created';
import { TicketCreatedListener } from './ticket-created';
import { TicketUpdatedListener } from './ticket-updated';

export const listenToEvents = (client: Stan) => {
  new TicketCreatedListener(client).listen();
  new TicketUpdatedListener(client).listen();
  new OrderExpiredListener(client).listen();
  new PaymentCreatedListener(client).listen();
};
