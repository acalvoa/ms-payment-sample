import { PaymentStatus } from "src/enums/payment-status.enum";
import { PaymentType } from "src/enums/payment-type.enum";
import { Payment } from "src/models/payment.model";

export const PaymentFixture: Payment = {
  id: 99999,
  tx: 'hdhes74g4g56h3j',
  txp: 'a42ds52gd63g2',
  gateway: 7654,
  provider: 1,
  type: PaymentType.CREDIT,
  country: 'CL',
  order: 654,
  net: 10000,
  commission: 2000,
  currency: 'CLP',
  tax: 2000,
  amount: 14000,
  metadata: {},
  status: PaymentStatus.CREATED,
  createdAt: new Date(),
  completedAt: new Date()
}