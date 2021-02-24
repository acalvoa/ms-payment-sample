import { Event } from './event.model';

export interface SubEvent {
  readonly id?: number;
  readonly name: string;
  readonly description: string;
  readonly event: Event | number;
  readonly timezone: string;
  readonly startDate: Date;
  readonly endDate: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}