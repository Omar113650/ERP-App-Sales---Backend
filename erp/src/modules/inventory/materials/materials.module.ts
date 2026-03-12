import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialController } from './materials.controller';
import { MaterialService } from './materials.service';
import { Material } from './entities/materials.entities';
import { Item } from '../item/entities/item.entities';
import { AuthModule } from '../../auth/auth.module';
import { AuthMiddleware } from '../../../core/middleware/auth/auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Material, Item]), AuthModule],
  controllers: [MaterialController],
  providers: [MaterialService],
  exports: [MaterialService],
})
export class MaterialModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(MaterialController);
  }
}
