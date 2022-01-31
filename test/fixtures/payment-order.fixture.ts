import { PaymentOrder } from "src/models/payment-order.model";

export const PaymentOrderFixture: PaymentOrder = {
  tx: 'DGHF3637dhs',
  amount: 3000,
  url: 'http://payment_test:3000',
  method: 'POST',
  data: {},
  callback: 'http://payment_test:3000/callback',
  cancel: 'http://payment_test:3000/cancel',
}