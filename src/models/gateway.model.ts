import { Country } from "./country.model";
import { PaymentType } from "../enums/payment-type.enum";
import { Provider } from "./provider.model";

export interface Gateway {
  readonly id?: number;
  readonly provider: Provider | number;
  readonly type: PaymentType;
  readonly country: Country | number;
  readonly commission: number;
  readonly tax: number;
}