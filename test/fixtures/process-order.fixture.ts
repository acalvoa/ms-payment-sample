import { ProcessOrderDto } from "../../src/modules/payments/dto/create-payment.dto";

export const ProcessOrderFixture: any = {
  event: {},
  total: 10000,
  tickets: [],
  discount: {},
  userData: {},
  answers: [],
  payment: 9,
  order: {
    id: 7
  },
  country: 'CL',
  currency: 'CLP'
}