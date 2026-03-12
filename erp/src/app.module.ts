import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfig from './config/jwt.config';
import databaseConfig from './config/DB.config';
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { CloudinaryModule } from './infrastructure/cloudinary/cloudinary.module';
import { BranchModule } from './modules/branches/branch.module';
import { EmailModule } from './modules/email/email.module';
import { CategoryModule } from './modules/inventory/category/category.module';
import { MaterialModule } from './modules/inventory/materials/materials.module';
import { ItemModule } from './modules/inventory/item/item.module';
import { OrderModule } from './modules/sales/order/order.module';
import { OrderItemModule } from './modules/sales/order_item/order_item.module';
import { PaymentModule } from './modules/sales/payment/payment.module';
import { CacheModule } from './infrastructure/cache/cache.module';
import { AiModule } from './infrastructure/Chat-Ai/ai.module';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV !== 'PRODUCTION' ? '.env' : '.env.production',
      load: [databaseConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),

      inject: [ConfigService],
    }),

    SentryModule.forRoot(),
    AuthModule,
    TenantModule,
    CloudinaryModule,
    BranchModule,
    EmailModule,
    CategoryModule,
    MaterialModule,
    ItemModule,
    OrderModule,
    OrderItemModule,
    PaymentModule,
    CacheModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    AppService,
  ],
})
export class AppModule {}
