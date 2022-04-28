import { Publisher, OrderCreatedEvent, Subjects } from "@pintickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
}

