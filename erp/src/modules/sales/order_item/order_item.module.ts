// order-item.module.ts

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order_item.entities';
import { Order } from '../order/entities/order.entities';
import { Item } from '../../inventory/item/entities/item.entities';
import { OrderItemService } from './order_item.service';
import { OrderItemController } from './order_item.controller';
import { AuthModule } from '../../auth/auth.module';
import { AuthMiddleware } from '../../../core/middleware/auth/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderItem,
      Order,
      Item,
    ]),AuthModule
  ],
  controllers: [OrderItemController],
  providers: [OrderItemService],
  exports: [OrderItemService],
})

export class OrderItemModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(OrderItemController);
  }
}



