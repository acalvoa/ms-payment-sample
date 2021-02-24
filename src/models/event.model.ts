import { EventCategory } from "src/enums/event-category.enum";
import { EventPrivacy } from "src/enums/event-privacy.enum";
import { EventStatus } from "src/enums/event-status.enum";
import { EventType } from "src/enums/event-type.enum";
import { Visibility } from "src/enums/visibility.enum";
import { EventDesign } from "./event-design.model";
import { EventTicket } from "./event-ticket.model";
import { Producer } from "./producer.model";

export interface Event {
  readonly id?: number;
  readonly producer?: Producer | number;
  readonly name: string;
  readonly category: EventCategory;
  readonly address: string;
  readonly place: string;
  readonly position: any;
  readonly township: string;
  readonly state: string;
  readonly country: string;
  readonly countryCode: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly timezone: string;
  readonly type: EventType;
  readonly privacy: EventPrivacy;
  readonly visibility: Visibility;
  readonly status?: EventStatus;
  readonly corporate?: boolean;
  design?: EventDesign;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
  readonly tickets?: EventTicket[];
}