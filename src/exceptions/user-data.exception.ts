import { GeneralException } from "./general.exception";

export class UserDataException extends GeneralException {
  constructor(e?: Error) {
    super(e);
  }
}