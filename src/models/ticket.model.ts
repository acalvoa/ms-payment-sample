import { TicketStatus } from "src/enums/ticket-status.enum";
import { Order } from "./order.model";
import { SubEvent } from "./subevent.model";
import { User } from "./user.model";
import { Event } from './event.model';
import { EventTicket } from "./event-ticket.model";
import { TicketOrigin } from "src/enums/ticket-origin.enum";
import { ReadStreamingDto } from "src/modules/orders/dto/read-streaming.dto";
import { Consumer } from "./consumer.model";

export class Ticket {
  public id?: number;
  public consumers?: Consumer[];
  public user: User | number;
  public eventTicket: EventTicket | number;
  public event: Event | number;
  public order: Order | number;
  public subevent: SubEvent |number;
  public holder: User | number;
  public discount: number;
  public coupon?: string;
  public paid: number;
  public commission: number;
  public origin: TicketOrigin;
  public status: TicketStatus;
  public reusable: boolean;
  public createdAt: Date | string;
  public updatedAt?: Date | string;
  public streamings?: ReadStreamingDto[];
  public token?: string;
  public link?: string;
}