import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthMiddleware } from '../../../core/middleware/auth/auth.middleware';
import { AuthModule } from '../../auth/auth.module';
import { Order } from './entities/order.entities';
import { Item } from '../../inventory/item/entities/item.entities';
import { Tenant } from '../../tenant/entities/tenant.entities';
import { Branch } from '../../branches/entities/branch.entities';
import { OrderItem } from '../order_item/entities/order_item.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Tenant, Branch, Item, OrderItem]),
    AuthModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(OrderController);
  }
}
