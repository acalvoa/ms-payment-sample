import { OrderStatus } from "src/enums/order-status.enum";
import { User } from "./user.model";

export interface Order {
  readonly id?: number;
  readonly tx: string;
  readonly payment?: number;
  readonly status: OrderStatus;
  readonly user: User | number;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}