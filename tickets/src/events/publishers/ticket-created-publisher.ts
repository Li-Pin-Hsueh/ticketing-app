import { Publisher, Subjects, TicketCreatedEvent } from "@pintickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  
}