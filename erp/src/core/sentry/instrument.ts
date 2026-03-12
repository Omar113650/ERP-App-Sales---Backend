import * as Sentry from '@sentry/nestjs';

Sentry.init({
  dsn: 'https://410b30c6588b9aa33c206f0750d6faa3@o4511023424012288.ingest.us.sentry.io/4511023426568192',
  sendDefaultPii: true,
});
