import { PaymentOrder } from "src/models/payment-order.model";
import { Payment } from "src/models/payment.model";

export class PaymentResponse {
  public payment: Payment;
  public gatewayInfo: PaymentOrder;
}