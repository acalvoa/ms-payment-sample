import * as Sentry from '@sentry/node';

export class GeneralException extends Error {
  constructor(e: Error) {
    super();
    Sentry.captureException(e);
  }
}