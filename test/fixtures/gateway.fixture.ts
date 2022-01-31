import { PaymentType } from "src/enums/payment-type.enum";
import { Gateway } from "src/models/gateway.model";

export const GatewayFixture: Gateway = {
  id: 1,
  provider: {
    id: 2,
    name: 'test',
    image: 'http://localhost:3000/image/test',
    app: 'http://localhost:3000',
  },
  type: PaymentType.DEBIT,
  country: 'CL',
  commission: 0.12,
  tax: 0.19
};