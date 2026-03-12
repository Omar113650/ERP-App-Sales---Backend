import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { Branch } from './entities/branch.entities';
import { Tenant } from '../tenant/entities/tenant.entities';
import { AuthMiddleware } from '../../core/middleware/auth/auth.middleware';
import { AuthModule } from '../auth/auth.module';
// import { RecurringEntry } from '../accounting/entities/recurring-entry.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Branch, Tenant]), AuthModule],
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(BranchController);
  }
}
