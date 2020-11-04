import { Stan } from 'node-nats-streaming';

import { TicketCreatedListener } from './ticket-created';
import { TicketUpdatedListener } from './ticket-updated';

export const listen = (client: Stan) => {
  new TicketCreatedListener(client).listen();
  new TicketUpdatedListener(client).listen();
};
