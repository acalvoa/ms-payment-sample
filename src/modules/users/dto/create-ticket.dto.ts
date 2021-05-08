import { TicketOrigin } from "src/enums/ticket-origin.enum";
import { TicketStatus } from "src/enums/ticket-status.enum";
import { Order } from "src/models/order.model";
import { EventTicket } from "src/models/event-ticket.model";
import { Event } from "src/models/event.model";
import { SubEvent } from "src/models/subevent.model";
import { Ticket } from "src/models/ticket.model";
import { User } from "src/models/user.model";

export class CreateTicketDto implements Ticket {
  public user: number | User;
  public dni: string;
  public eventTicket: number | EventTicket;
  public event: number | Event;
  public order: number | Order;
  public subevent: number | SubEvent;
  public status: TicketStatus;
  public reusable: boolean;
  public createdAt: Date;
  public holder: User | number;
  public origin: TicketOrigin;
  public discount: number;
  public coupon: string;
  public paid: number;
  public commission: number;
}