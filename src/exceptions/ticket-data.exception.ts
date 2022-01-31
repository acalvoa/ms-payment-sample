import { GeneralException } from "./general.exception";

export class TicketDataException extends GeneralException {
  constructor(e?: Error) {
    super(e);
  }
}