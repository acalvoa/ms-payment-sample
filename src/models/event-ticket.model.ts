import { CommissionPayer } from "src/enums/commission-payer.enum";
import { EventTicketStatus } from "src/enums/event-ticket-status.enum";
import { EventTicketType } from "src/enums/event-ticket-type.enum";
import { Visibility } from "src/enums/visibility.enum";
import { Currency } from "./currency.model";
import { SubEvent } from "./subevent.model";
import { Event } from './event.model';

export interface EventTicket {
  readonly id?: number;
  readonly name: string;
  readonly commission: number;
  readonly amount: number
  readonly price: number;
  readonly currency: Currency | string;
  readonly event?: Event | number;
  readonly subevent?: SubEvent | number;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly timezone: string;
  readonly sellLimit: number;
  readonly commissionPayer: CommissionPayer;
  readonly status: EventTicketStatus;
  readonly type: EventTicketType;
  readonly visibility: Visibility;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}