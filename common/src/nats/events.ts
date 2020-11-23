import { OrderStatus } from './statuses';
import { SubjectType } from './subjects';

export interface Event {
  subject: SubjectType;
  data: any;
}

export interface TicketCreatedEvent {
  subject: SubjectType.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
  };
}

export interface TicketUpdatedEvent {
  subject: SubjectType.TicketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
  };
}

export interface OrderCreatedEvent {
  subject: SubjectType.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    version: number;
    ticket: {
      id: string;
      price: number;
      title: string;
    };
  };
}

export interface OrderCancelledEvent {
  subject: SubjectType.OrderCancelled;
  data: {
    id: string;
    version: number;
    ticket: {
      id: string;
    };
  };
}

export interface OrderExpiredEvent {
  subject: SubjectType.OrderExpired;
  data: {
    id: string;
  };
}

export interface PaymentCreatedEvent {
  subject: SubjectType.PaymentCreated;
  data: {
    id: string;
    orderId: string;
    stripeId: string;
  };
}
