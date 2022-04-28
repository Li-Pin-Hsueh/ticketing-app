import { Publisher, OrderCancelledEvent, Subjects } from "@pintickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}

