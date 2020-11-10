import {
  Publisher,
  SubjectType,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from '@pashkoostap-learning/ticketing-common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: SubjectType.TicketCreated = SubjectType.TicketCreated;
}

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: SubjectType.TicketUpdated = SubjectType.TicketUpdated;
}
