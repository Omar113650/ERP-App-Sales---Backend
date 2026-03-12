import { PartialType } from '@nestjs/swagger';
import { CreateOrderItemDto } from './order_Item.dto';

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {}
