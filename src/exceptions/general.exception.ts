import * as Sentry from '@sentry/node';

export class GeneralException extends Error {
  public error: Error;

  constructor(e: Error) {
    super();
    this.error = e;
  }
}