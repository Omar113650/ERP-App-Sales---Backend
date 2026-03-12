import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entities';
import { Tenant } from '../../tenant/entities/tenant.entities';
import { Item } from '../item/entities/item.entities';
import { AuthMiddleware } from '../../../core/middleware/auth/auth.middleware';
import { AuthModule } from '../../auth/auth.module';
@Module({
  imports: [TypeOrmModule.forFeature([Category, Tenant, Item]), AuthModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(CategoryController);
  }
}
