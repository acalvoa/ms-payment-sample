import { Exclude, Expose } from "class-transformer";
import { StreamingProvider } from "src/enums/streaming-provider.enum";
import { StreamingType } from "src/enums/streaming-type.enum";
import { EventTicket } from "src/models/event-ticket.model";

@Exclude()
export class ReadStreamingDto  {
  @Expose()
  readonly createdAt: Date;
  @Expose()
  readonly updatedAt: Date;
  @Expose()
  readonly id: number;
  @Expose()
  readonly name: string;
  @Expose()
  readonly type: StreamingType;
  @Expose()
  readonly metadata?: any;
  @Expose()
  readonly timezone: string;
  @Expose()
  readonly startDate: Date;
  @Expose()
  readonly endDate: Date;
  @Expose()
  readonly description?: string;
  @Expose()
  readonly background?: string;
  @Expose()
  readonly chat: boolean;
  @Expose()
  readonly reminder: number;
  @Expose()
  readonly provider: StreamingProvider;
  @Expose()
  readonly url: string;
  @Expose()
  readonly streamsAt: Date;
  @Expose()
  readonly eventTickets?: EventTicket[];
  @Expose()
  readonly dateString?: string;
  @Expose()
  readonly hourString?: string;
}