import { PaymentStatus } from "src/enums/payment-status.enum";
import { Gateway } from "./gateway.model";
import { PaymentType } from "../enums/payment-type.enum";
import { Provider } from "./provider.model";

export class Payment {
  public id?: number;
  public tx: string;
  public txp: string;
  public gateway: Gateway | number;
  public provider: Provider | number;
  public type: PaymentType;
  public country: string;
  public order: number;
  public net: number;
  public commission: number;
  public currency: string;
  public tax: number;
  public amount: number;
  public status: PaymentStatus;
  public createAt: Date;
  public completedAt: Date;
}