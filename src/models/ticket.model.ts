import { TicketStatus } from "src/enums/ticket-status.enum";
import { Order } from "./order.model";
import { SubEvent } from "./subevent.model";
import { User } from "./user.model";
import { Event } from './event.model';
import { EventTicket } from "./event-ticket.model";
import { TicketOrigin } from "src/enums/ticket-origin.enum";

export interface Ticket {
  readonly id?: number;
  readonly user: User | number;
  eventTicket: EventTicket | number;
  readonly event: Event | number;
  readonly order: Order | number;
  readonly subevent: SubEvent |number;
  readonly holder: User | number;
  readonly discount: number;
  readonly origin: TicketOrigin;
  readonly status: TicketStatus;
  readonly reusable: boolean;
  readonly createdAt: Date | string;
  readonly updatedAt?: Date | string;
  token?: string;
}