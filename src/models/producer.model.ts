import { EventCategory } from "src/enums/event-category.enum";
import { ProductionLevel } from "src/enums/production-level.enum";
import { ProductionType } from "src/enums/production-type.enum";
import { ProducerType } from "./producer-type.model";

export interface Producer {
  readonly id?: number;
  readonly name: string;
  readonly type: ProducerType | number;
  readonly level: ProductionLevel;
  readonly companyType: ProductionType;
  readonly category: EventCategory;
}