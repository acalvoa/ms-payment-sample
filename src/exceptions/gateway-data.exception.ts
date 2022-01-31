import { GeneralException } from "./general.exception";

export class GatewayDataException extends GeneralException {
  constructor(e?: Error) {
    super(e);
  }
}