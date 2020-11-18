import {
  PaymentCreatedEvent,
  Publisher,
  SubjectType,
} from '@pashkoostap-learning/ticketing-common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: SubjectType.PaymentCreated = SubjectType.PaymentCreated;
}
