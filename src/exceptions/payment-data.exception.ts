import { GeneralException } from "./general.exception";

export class PaymentDataException extends GeneralException {
  constructor(e?: any) {
    super(e);
  }
}