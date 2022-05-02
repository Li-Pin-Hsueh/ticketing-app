import { Subjects, Publisher, PaymentCreatedEvent } from "@pintickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}