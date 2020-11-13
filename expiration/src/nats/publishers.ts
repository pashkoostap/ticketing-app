import {
  Publisher,
  SubjectType,
  TicketCreatedEvent,
  TicketUpdatedEvent,
  OrderExpiredEvent,
} from '@pashkoostap-learning/ticketing-common';

export class OrderExpiredPublisher extends Publisher<OrderExpiredEvent> {
  subject: SubjectType.OrderExpired = SubjectType.OrderExpired;
}
