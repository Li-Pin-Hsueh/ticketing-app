import { Publisher, Subjects, TicketUpdatedEvent } from "@pintickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
  
}