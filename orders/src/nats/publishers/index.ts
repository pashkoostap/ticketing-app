import {
  OrderCancelledEvent,
  OrderCreatedEvent,
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

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: SubjectType.OrderCreated = SubjectType.OrderCreated;
}

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: SubjectType.OrderCancelled = SubjectType.OrderCancelled;
}
