import { GeneralException } from "./general.exception";

export class InternalServerException extends GeneralException {
  constructor(e?: Error) {
    super(e);
  }
}