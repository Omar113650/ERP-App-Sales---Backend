import * as Sentry from "@sentry/nestjs";
import "./core/sentry/instrument";
import { spawn } from 'child_process';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { SentryFilter } from "./core/sentry/global.filter";
dotenv.config();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0, 
});

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.useGlobalFilters(new SentryFilter());

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.enableVersioning({
    type: VersioningType.URI, // النوع
    defaultVersion: '1', // النسخة الافتراضية لو مش محددة
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );


  const port = process.env.PORT || 8000;
  await app.listen(port,'0.0.0.0');
  console.log(`Server running on http://localhost:${port}`);


// mcp
const mcpPath = './src/infrastructure/mcp/mcp.server.ts';
const mcp = spawn('npx', [
    'tsx',
    mcpPath
  ], {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd(), 
  });

  mcp.on('error', (err) => {
    console.error('MCP server failed to start:', err);
  });

  mcp.on('close', (code) => {
    console.log(`MCP server exited with code ${code}`);
  });
}

bootstrap();
