import { GeneralException } from "./general.exception";

export class GatewayProviderException extends GeneralException {
  constructor(e?: Error) {
    super(e);
  }
}