import { GeneralException } from "./general.exception";

export class ConsumerDataException extends GeneralException {
  constructor(e?: Error) {
    super(e);
  }
}