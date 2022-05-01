import { Subjects, Publisher, ExpirationCompleteEvent } from "@pintickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
  
}