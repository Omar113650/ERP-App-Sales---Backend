import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemController } from './item.controller';
import { ItemService } from './item.service';
import { Item } from './entities/item.entities';
import { Category } from '../category/entities/category.entities';
import { Tenant } from '../../tenant/entities/tenant.entities';
import { AuthModule } from '../../auth/auth.module';
import { AuthMiddleware } from '../../../core/middleware/auth/auth.middleware';
import { CloudinaryModule } from '../../../infrastructure/cloudinary/cloudinary.module';
@Module({
  imports: [TypeOrmModule.forFeature([Item, Category, Tenant]), AuthModule,CloudinaryModule],
  controllers: [ItemController],
  providers: [ItemService],
  exports: [ItemService],
})
export class ItemModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(ItemController);
  }
}

