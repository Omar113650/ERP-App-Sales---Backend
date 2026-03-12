import { Controller, Get } from '@nestjs/common';

@Controller('debug-sentry')
export class AppController {

  @Get()
  getError() {
    throw new Error('My first Sentry error!');
  }

}