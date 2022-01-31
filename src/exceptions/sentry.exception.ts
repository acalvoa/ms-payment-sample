import * as Sentry from '@sentry/node';

export class SentryException extends Error {
  public error: Error;

  constructor(e: Error) {
    super();
    Sentry.captureException(e);
  }
}  