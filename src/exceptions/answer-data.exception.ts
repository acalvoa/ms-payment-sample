import { GeneralException } from "./general.exception";

export class AnswerDataException extends GeneralException {
  constructor(e?: Error) {
    super(e);
  }
}