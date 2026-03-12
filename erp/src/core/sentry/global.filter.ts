import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';

@Catch()
export class SentryFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    Sentry.captureException(exception);
  }
}