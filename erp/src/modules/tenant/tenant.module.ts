import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantServices } from './tenant.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './entities/tenant.entities';
import { User } from '../users/entities/user.entities';
import { CloudinaryModule } from '../../infrastructure/cloudinary/cloudinary.module';
import { AuthModule } from '../auth/auth.module';
import { AuthMiddleware } from '../../core/middleware/auth/auth.middleware';
import{LoggerMiddleware} from '../../core/middleware/logger.middleware'
// import { Account } from '../accounting/entities/account.entity';
// import { JournalEntry } from '../accounting/entities/journal-entry.entity';
// import { JournalLine } from '../accounting/entities/journal-line.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant, User]),
    CloudinaryModule,
    AuthModule,
  ],
  controllers: [TenantController],
  providers: [TenantServices],
  exports: [TenantServices],
})

export class TenantModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware,LoggerMiddleware).forRoutes(TenantController);
  }
}

